# Sincronizacion Jira -> GitHub issues

Automatiza que cada ticket **abierto** de Jira exista como issue de GitHub, y que
al pasar a "Listo" en Jira su issue se cierre. Jira es la fuente de verdad (sync
en una via). No requiere apps de pago; corre dentro de GitHub Actions.

- Workflow: [`.github/workflows/jira-sync.yml`](workflows/jira-sync.yml)
- Script: [`.github/scripts/jira_github_sync.py`](scripts/jira_github_sync.py)

## Que hace

- Ticket abierto en Jira (estado distinto de Listo): crea o actualiza su issue.
- Ticket que pasa a Listo: cierra el issue de GitHub si existe.
- Idempotente: el issue se identifica por el prefijo `[TICKET-XX]` del titulo, asi
  que se puede correr cuantas veces sea necesario sin duplicar.
- Corre cada 15 min (cron), on-demand (Actions -> Run workflow) y, si configuras
  la regla de Jira de abajo, de forma **instantanea** ante cada cambio.

## Configuracion (una sola vez)

1. **API token de Atlassian**: en https://id.atlassian.com/manage-profile/security/api-tokens
   crea un token con la cuenta que tenga acceso al proyecto Jira.

2. **Secretos del repo** (Settings -> Secrets and variables -> Actions -> Secrets):
   - `JIRA_BASE_URL` = `https://aleseminario.atlassian.net`
   - `JIRA_EMAIL` = el email de esa cuenta de Atlassian
   - `JIRA_API_TOKEN` = el token del paso 1

3. **Variable del repo** (misma pantalla, pestana Variables):
   - `JIRA_SYNC_ENABLED` = `true`

Con eso, el sync ya corre cada 15 min. El `GITHUB_TOKEN` del workflow ya tiene
permiso de issues (definido en el workflow), no hay que crear nada mas.

## Sync instantaneo (opcional pero recomendado)

Para que el sync ocurra al instante ante cada cambio en Jira, agrega una regla de
Automation en Jira que dispare el workflow via `repository_dispatch`:

1. Crea un **Personal Access Token de GitHub** (fine-grained) con permiso
   `Contents: read` y `Metadata: read` sobre este repo... en realidad solo se
   necesita permiso para disparar el dispatch: usa un token clasico con scope
   `repo` (o fine-grained con `Contents: write`).
2. En Jira: **Project settings -> Automation -> Create rule**:
   - **Trigger**: `Issue updated` (y otra regla con `Issue created`), o
     `Field value changed` sobre Estado para reaccionar solo a cambios de estado.
   - **Action**: `Send web request`:
     - URL: `https://api.github.com/repos/seminarioA/findParking/dispatches`
     - Method: `POST`
     - Headers:
       - `Authorization: Bearer <GITHUB_PAT>`
       - `Accept: application/vnd.github+json`
       - `X-GitHub-Api-Version: 2022-11-28`
     - Body (custom data):
       ```json
       { "event_type": "jira-sync" }
       ```
3. Guarda y activa la regla. Cada cambio en Jira dispara el workflow, que reconcilia
   los issues en segundos.

## Notas

- El script usa solo la stdlib de Python + la CLI `gh`; no instala dependencias.
- Convencion de los issues: titulo `[TICKET-XX] <resumen>`, body con link al ticket
  de Jira, descripcion y metadata (estado / prioridad / rol / responsable), y labels
  `jira-sync` + area (`backend`/`frontend`/`devops`) + `security`/`reliability`.
- Es sync en una via (Jira -> GitHub). Para bidireccional (comentarios/cierres de
  GitHub que vuelvan a Jira) haria falta una integracion tipo Unito/Exalate.
