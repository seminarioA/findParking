# Guía de contribución — findParking

Este repositorio impone una **estructura obligatoria** sobre los commits y los Pull Requests.
Las reglas se validan automáticamente en CI (workflow [`PR Structure`](workflows/pr-structure.yml))
y son **checks requeridos** en la protección de rama de `main`: un PR no se puede mergear si no cumplen.

## Convención: Conventional Commits

Tanto el **título del PR** como **cada mensaje de commit** deben seguir
[Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope opcional): descripción en minúscula

cuerpo opcional

footer opcional
```

### Tipos permitidos

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | Formato, sin cambio de lógica |
| `refactor` | Cambio de código sin alterar comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Pruebas |
| `build` | Sistema de build o dependencias |
| `ci` | Pipeline / GitHub Actions |
| `chore` | Mantenimiento |
| `revert` | Revertir un commit previo |
| `security` | Corrección de seguridad |

### Ejemplos válidos

```
feat(frontend): agrega vista de histórico de ocupación
fix(auth): revoca el jti en el logout
security(frontend): sube vite para cerrar CVE del dev server
docs(wiki): agrega página Design-System
```

### Ejemplos inválidos

```
Arregla el login            # sin tipo
Fix(auth): ...              # subject/tipo mal formado, empieza en mayúscula
update deps                 # sin tipo
```

## Estructura del Pull Request

Al abrir un PR se carga automáticamente [`pull_request_template.md`](pull_request_template.md).
Completa todas las secciones: **Descripción**, **Tipo de cambio**, **Checklist**, **Testing** y
**Tickets relacionados**. Enlaza el ticket de Jira correspondiente (`Closes TICKET-XX`).

## Qué se valida en CI

1. **Título del PR** → `amannn/action-semantic-pull-request` (Conventional Commits).
2. **Mensajes de commit** → `wagoid/commitlint-github-action` con [`.commitlintrc.json`](../.commitlintrc.json).
3. **Checks preexistentes** de `ci-cd-pipeline.yml`: tests (pytest) y lint/seguridad (ruff + pip-audit).

Todos deben estar en verde para poder mergear a `main`.
