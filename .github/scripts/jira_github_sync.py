#!/usr/bin/env python3
"""Sincroniza tickets de Jira -> issues de GitHub (una via; Jira es la fuente de verdad).

Reglas:
  - Ticket ABIERTO en Jira (statusCategory != done): crea o actualiza su issue de GitHub.
  - Ticket que paso a Listo (statusCategory == done): cierra el issue de GitHub si existe.
    (No se crean issues para tickets que ya estaban Listos y nunca tuvieron issue.)
  - Idempotente: cada issue se identifica por el prefijo "[TICKET-XX]" en el titulo.

No usa dependencias externas: urllib (stdlib) para la API de Jira y la CLI `gh`
(autenticada por GITHUB_TOKEN) para GitHub.

Variables de entorno requeridas:
  JIRA_BASE_URL   p.ej. https://aleseminario.atlassian.net
  JIRA_EMAIL      email de la cuenta de Atlassian dueña del API token
  JIRA_API_TOKEN  API token de Atlassian (id.atlassian.com -> Security -> API tokens)
  GH_REPO         owner/repo (lo inyecta el workflow como ${{ github.repository }})
  GH_TOKEN        token de GitHub para `gh` (lo inyecta el workflow)
Opcional:
  JIRA_PROJECT    clave del proyecto de Jira (default: TICKET)
"""

import base64
import json
import os
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request

JIRA_BASE = os.environ["JIRA_BASE_URL"].rstrip("/")
JIRA_EMAIL = os.environ["JIRA_EMAIL"]
JIRA_TOKEN = os.environ["JIRA_API_TOKEN"]
REPO = os.environ["GH_REPO"]
PROJECT = os.environ.get("JIRA_PROJECT", "TICKET")

AUTH = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_TOKEN}".encode()).decode()
BROWSE = f"{JIRA_BASE}/browse"

# Quita emojis / simbolos decorativos de cualquier texto que va a GitHub.
EMOJI = re.compile(
    "[\U0001f000-\U0001faff\U00002600-\U000027bf\U00002b00-\U00002bff"
    "\U0001f1e6-\U0001f1ff\U0000fe00-\U0000fe0f\U00002190-\U000021ff]"
)

ROL_LABEL = {"DevOps/Infra": "devops", "Backend": "backend", "Frontend/UI-UX": "frontend"}
LABELS = [
    ("jira-sync", "ededed", "Sincronizado desde un ticket de Jira"),
    ("backend", "1d76db", "Area: Backend"),
    ("frontend", "0e8a16", "Area: Frontend/UI-UX"),
    ("devops", "d93f0b", "Area: DevOps/Infra"),
    ("security", "b60205", "Seguridad"),
    ("reliability", "fbca04", "Fiabilidad"),
]


def clean(s):
    if not s:
        return ""
    s = s.replace("→", "->").replace("←", "<-")
    return EMOJI.sub("", s)


def gh(args, **kw):
    return subprocess.run(["gh", *args], capture_output=True, text=True, **kw)


def jira_search():
    """Trae todos los tickets del proyecto (API v2: description como string)."""
    jql = f"project = {PROJECT} ORDER BY key ASC"
    fields = "summary,description,status,priority,labels,issuetype,assignee,customfield_10170"
    out, start = [], 0
    while True:
        qs = urllib.parse.urlencode(
            {"jql": jql, "fields": fields, "maxResults": 100, "startAt": start}
        )
        req = urllib.request.Request(
            f"{JIRA_BASE}/rest/api/2/search?{qs}",
            headers={"Authorization": f"Basic {AUTH}", "Accept": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.load(r)
        out.extend(data["issues"])
        start += data["maxResults"]
        if start >= data["total"]:
            return out


def existing_issues():
    """Mapa TICKET-XX -> {number, state} a partir del prefijo del titulo."""
    r = gh(["issue", "list", "-R", REPO, "--state", "all", "--limit", "1000",
            "--json", "number,title,state"])
    m = {}
    for it in json.loads(r.stdout or "[]"):
        mm = re.match(r"\[(TICKET-\d+)\]", it["title"])
        if mm:
            m[mm.group(1)] = it
    return m


def ensure_labels():
    for name, color, desc in LABELS:
        gh(["label", "create", name, "-R", REPO, "--color", color,
            "--description", desc, "--force"])


def render(key, f):
    summary = clean(f["summary"])
    status = f["status"]["name"]
    prio = (f.get("priority") or {}).get("name", "-")
    rol = (f.get("customfield_10170") or {}).get("value", "-")
    assignee = (f.get("assignee") or {}).get("displayName", "Sin asignar")
    desc = clean(f.get("description") or "_Sin descripcion en Jira._")

    title = f"[{key}] {summary}"
    body = (
        f"Sincronizado desde Jira: [{key}]({BROWSE}/{key})\n\n"
        f"{desc}\n\n"
        "---\n"
        f"- Estado en Jira: {status}\n"
        f"- Prioridad: {prio}\n"
        f"- Rol: {rol}\n"
        f"- Responsable: {assignee}\n"
        f"\n<!-- jira-sync:{key} -->\n"
    )
    labels = ["jira-sync"]
    if rol in ROL_LABEL:
        labels.append(ROL_LABEL[rol])
    low = summary.lower()
    if low.startswith("[seguridad]"):
        labels.append("security")
    if low.startswith("[fiabilidad]"):
        labels.append("reliability")
    return title, body, labels


def bodyfile(text):
    tf = tempfile.NamedTemporaryFile("w", suffix=".md", delete=False)
    tf.write(text)
    tf.close()
    return tf.name


def main():
    ensure_labels()
    existing = existing_issues()
    created = updated = closed = 0

    for jira in jira_search():
        key = jira["key"]
        f = jira["fields"]
        done = f["status"]["statusCategory"]["key"] == "done"
        ex = existing.get(key)

        if done:
            if ex and ex["state"] == "OPEN":
                gh(["issue", "close", str(ex["number"]), "-R", REPO,
                    "-c", f"Cerrado automaticamente: {key} paso a "
                          f"'{f['status']['name']}' en Jira."])
                closed += 1
                print(f"{key}: closed #{ex['number']}")
            continue

        title, body, labels = render(key, f)
        if ex:
            args = ["issue", "edit", str(ex["number"]), "-R", REPO,
                    "--title", title, "--body-file", bodyfile(body)]
            for lb in labels:
                args += ["--add-label", lb]
            gh(args)
            if ex["state"] != "OPEN":
                gh(["issue", "reopen", str(ex["number"]), "-R", REPO])
            updated += 1
            print(f"{key}: updated #{ex['number']}")
        else:
            args = ["issue", "create", "-R", REPO, "--title", title,
                    "--body-file", bodyfile(body)]
            for lb in labels:
                args += ["--label", lb]
            r = gh(args)
            created += 1
            print(f"{key}: created {r.stdout.strip()}")

    print(f"\nResumen: {created} creados, {updated} actualizados, {closed} cerrados.")


if __name__ == "__main__":
    main()
