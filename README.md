# FindParking


FindParking es una plataforma de visión por computadora en tiempo real para determinar ocupación de plazas de estacionamiento (libre / ocupada) a partir de streams de video.
---

## 1. Descripción General

FindParking captura frames de cámaras configuradas, ejecuta detección de vehículos con YOLO + OpenCV, mapea detecciones a plazas definidas y expone la ocupación actual mediante REST y WebSockets. Objetivos de diseño:

- Actualizaciones incrementales de baja latencia.
- Separación clara de responsabilidades (auth / inferencia / estado / streaming / UI).
- Control de acceso por roles (p.ej. video crudo vs procesado).
- Servicios sin estado que escalan horizontalmente (cómputo efímero; Redis como estado compartido).
- Camino de endurecimiento productivo: observabilidad, seguridad, pruebas automatizadas.

---

## 2. Arquitectura del Sistema

Flujo lógico:

```
[Cámaras/Archivos] --> processing_service --> Redis (frames, claves de ocupación) --> occupancy_service --> REST & WS (ocupación)
                                          |                                         \
                                          |                                          -> frontend_service (React)
                                          +-> video_service (WebSocket video)
                 auth_service (emisión/verificación JWT, roles y revocación)
                                ^
                           api_gateway (NGINX reverse proxy, enrutado, TLS, headers)
```

Microservicios (según repositorio y docker-compose):

| Servicio              | Propósito                                                                    | Puertos (host:cont) | Tecnologías |
|-----------------------|-------------------------------------------------------------------------------|---------------------|-------------|
| redis                 | Cache / pub-sub efímero (frames, mapas de ocupación)                         | 6379:6379           | Redis 7     |
| postgres              | Persistencia de usuarios y blacklist de tokens                               | 5432:5432           | Postgres    |
| auth_service          | Registro, login, gestión de roles, revocación de tokens                      | 8000:8000           | FastAPI, SQLAlchemy, JWT |
| processing_service    | Inferencia YOLO/OpenCV; publica frames y datos de ocupación en Redis         | (interno)           | Python, ultralytics, OpenCV |
| occupancy_service     | Agrega y sirve ocupación (REST + WS)                                         | 8002:8000           | FastAPI, Redis |
| video_service         | Streaming WebSocket (raw / processed) con control de roles                   | 8004:8004           | FastAPI (WS), JWT |
| video_stream_service  | Ingesta (mp4 u origen) → inserta frames en Redis (pipeline de entrada)       | 8010:8010           | Python, OpenCV |
| api_gateway           | Entrada unificada (reverse proxy /api/*)                                     | 80:80               | NGINX       |
| frontend_service      | Interfaz Web (build React servido en contenedor)                             | 3000:80             | React, Vite, TS |

Diagrama de arquitectura (fuente): DIAGRAMA DE MICROSERVICIOS - FINDPARKING.drawio  
(Exportar a `docs/architecture.png` en el build de CI para documentación completa.)

---

## 3. Flujo de Datos

1. video_stream_service (o cámaras) empuja frames → Redis (ej. claves frame_<cámara>).
2. processing_service consume frames, ejecuta YOLO → produce bounding boxes.
3. Vehículos detectados se mapean a regiones/plazas configuradas → mapa de ocupación en Redis (clave: occupancy_<camera_id>).
4. occupancy_service:
   - REST: GET /api/occupancy/{camera_id} construye { areas, summary } desde Redis.
   - WS: /api/occupancy/{camera_id}/ws publica snapshots JSON periódicos.
5. video_service:
   - Emite frames procesados o crudos por WebSockets según rol.
6. frontend_service:
   - Autentica → obtiene token → consulta ocupación y se suscribe a streams WS.

---

## 4. Referencia de API (Endpoints Implementados)

Todos los endpoints pasan por el api_gateway (/api/…) y usan Bearer JWT salvo indicación contraria.

### 4.1 Autenticación (auth_service, prefijo /api/auth)

| Método | Ruta        | Descripción                               | Auth | Notas |
|--------|-------------|--------------------------------------------|------|-------|
| POST   | /register   | Crea usuario (email, password, rol opcional) | No   | Valida email único |
| POST   | /login      | Obtiene token JWT                          | No   | Respuesta: {access_token} |
| POST   | /logout     | Revoca token actual (blacklist jti)        | Sí   | Inserta jti en DB |
| GET    | /me         | Email y rol actual                        | Sí   | Usa header Authorization |
| GET    | /verify     | Verifica sujeto y rol                     | Sí   | Validación ligera |
| POST   | /set-role   | Cambia rol de otro usuario                | Sí (superadmin) | Body: email, new_role |

Claims del token: { sub: <email>, role: <rol>, jti: <uuid>, exp: <timestamp> }

### 4.2 Ocupación (occupancy_service)

| Método | Ruta                                  | Descripción                                 | Auth |
|--------|----------------------------------------|---------------------------------------------|------|
| GET    | /api/occupancy/{camera_id}            | Mapa actual de ocupación + resumen          | Sí   |
| WS     | /api/occupancy/{camera_id}/ws?token=Bearer%20<JWT> | Snapshots JSON periódicos (areas + summary) | Sí (query param) |

Respuesta REST de ocupación:
```json
{
  "areas": { "P1": 1, "P2": 0 },
  "summary": { "occupied": 12, "free": 8 }
}
```
(1 = ocupado, 0 = libre)

Snapshot WS:
```json
{
  "areas": { "P1": 1, "P2": 0 },
  "summary": { "occupied": 1, "free": 1 }
}
```

### 4.3 Video (video_service)

| Canal | Ruta                               | Roles Permitidos       | Carga |
|-------|------------------------------------|------------------------|-------|
| WS    | /api/video/{camera_id}/processed   | admin, gestor          | Frames binarios (procesados) |
| WS    | /api/video/{camera_id}/raw         | admin                  | Frames binarios (crudos)     |

Handshake: Cliente envía JWT en `sec-websocket-protocol`; el servicio valida rol antes de aceptar.

---

## 5. Configuración y Variables de Entorno

Variables principales (ver .env de cada servicio):

Auth:
- JWT_SECRET
- ACCESS_TOKEN_EXPIRE_MINUTES (60 por defecto)
- DATABASE_URL (en docker-compose se nombra así; en código hay referencias a DB_URL/SECRET_KEY: unificar)
- SECRET_KEY (uso legado / adicional)

Redis:
- REDIS_HOST (por defecto `redis`)
- REDIS_PORT (6379)
- REDIS_DB (0)

Procesamiento / Video:
- VIDEO_PATHS (mapa JSON para video_stream_service, ej. {"entrada1":"resources/parking1.mp4"})
- MODEL_PATH / YOLO weights (añadir variable explícita si no existe)
- Parámetros de inferencia (intervalo de frame, umbral de confianza) — documentar y exponer

Ocupación:
- JWT_ALGORITHM (HS256 por defecto)
- JWT_SECRET (debe coincidir con auth_service)

Acciones de endurecimiento:
- Externalizar secretos (no en código ni compose plano).
- Unificar nombres de variables para evitar configuraciones inconsistentes.

---

## 6. Construcción, Ejecución y Despliegue

### 6.1 Local (todos los servicios)

Requisitos: Docker y Docker Compose.

```bash
docker-compose up --build
```

Puntos de acceso:
- Frontend: http://localhost:3000
- Gateway: http://localhost
- Auth: http://localhost:8000
- Occupancy: http://localhost:8002
- Video: http://localhost:8004

### 6.2 Desarrollo Selectivo (ej. auth_service)

```bash
cd services/auth_service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Servicios dependientes (Redis/Postgres):

```bash
docker-compose up -d redis postgres
```

### 6.3 Revisión de Script de Despliegue

Archivo `deploy-ec2-ubuntu.sh` contiene un PAT de GitHub expuesto. ACCIÓN OBLIGATORIA:
- Revocar token filtrado de inmediato.
- Borrar su rastreo histórico (git filter-repo / BFG si procede).
- Migrar a despliegue con CI y secretos gestionados (SSM / Secrets Manager / Vault).

---

## 7. Seguridad

Implementado:
- JWT HS256 con revocación (lista negra por jti).
- Control de roles para segmentar acceso a video raw.
- Hash de contraseñas (bcrypt via passlib).

Riesgos / Vacíos:
- Secretos claros en docker-compose (mover a gestor de secretos).
- Sin rate limiting en API Gateway.
- Sin TLS por defecto.
- PAT expuesto (script).

Recomendaciones:
- TLS + HSTS.
- Rate limiting (NGINX `limit_req`).
- Cabeceras seguras (CSP, X-Content-Type-Options, etc.).
- Registro de auditoría para /set-role.
- Tokens de corta vida + refresh opcional si aumenta la superficie.

---

## 8. Observabilidad

(No completo aún.)

Métricas recomendadas:
- inference_latency_seconds (histograma)
- frames_processed_total
- occupancy_updates_total
- ws_active_connections
- jwt_invalid_total
- token_revoked_total

Logging:
- Formato JSON: {ts, service, level, camera_id, event, latency_ms}.
- Propagar `request_id` desde gateway.

Trazabilidad (futuro):
- Spans: capture_frame, yolo_inference, occupancy_compute, ws_dispatch.
- OpenTelemetry + Jaeger/OTLP.

Alertas:
- p95 inference_latency_seconds > umbral.
- Caída abrupta en frames_processed_total.
- Incremento en jwt_invalid_total.

---

## 9. Rendimiento y Escalabilidad

Vectores de escalado:
- processing_service por cámara / GPU / partición.
- Redis escalado (cluster) si aumenta ancho de banda.
- Separar streaming crudo en canal especializado si crece ancho de banda.

Backpressure:
- Saltar frames cuando cola supere umbral configurado.

Optimización:
- Downscaling previo a inferencia.
- Modelos YOLO ligeros (nano) vs más pesados.
- FP16 / GPU si hardware disponible.

---

## 10. Confiabilidad y Manejo de Fallos

Estado actual:
- WebSockets capturan desconexiones pero sin reconexión automática de upstream.
- Respuesta vacía controlada cuando falta ocupación en Redis.

Pendiente:
- Health checks (/healthz, /ready).
- Reintentos / backoff para ingestión de video.
- Mecanismos de auto-reinicio ante falla de inferencia.

Acciones sugeridas:
- Añadir endpoints de salud per servicio.
- Watchdog en video_stream_service para reconectar fuente.
- Circuit breaker a Redis para tolerar latencias.

---

## 11. Modelo de Datos (Auth)

Tablas Postgres:
- users(id, email, hashed_password, role)
- token_blacklist(id, jti, created_at)

Datos efímeros:
- Frames: frame_<camera_id>[_processed/raw]
- Ocupación: occupancy_<camera_id>

Sin persistencia histórica. Para analítica incorporar un servicio TSDB (TimescaleDB) y publicador de eventos.

---

## 12. Pruebas

Pruebas existentes:
- test_occupancy.py: verifica ocupación + auth.
- test_gateway.py: login y proxy de ocupación.

Inconsistencias:
- Tests usan /api/auth/token mientras el servicio implementa /api/auth/login.

Brechas:
- Sin pruebas específicas de video_service (WS roles).
- Sin pruebas de revocación inmediata.

Mejoras:
1. Alias /token o ajuste de tests.
2. Pruebas async WS (ocupación + video).
3. Casos negativos (token revocado, rol insuficiente).
4. Carga (Locust / k6) para pipeline inferencia → ocupación.

Ejecución:
```bash
pytest -q
```

---

## 13. Versionado y Lanzamientos

Adoptar SemVer:
- MAJOR: Cambios incompatibles (contrato endpoints / claims).
- MINOR: Funcionalidades compatibles.
- PATCH: Correcciones y mejoras no disruptivas.

Agregar endpoint /version (hash commit + hash modelo YOLO) para trazabilidad.

CI recomendado:
- Linter (ruff / flake8, ESLint).
- Auditorías (pip-audit, npm audit, trivy).
- Tests unitarios e integración.
- Imágenes multi-arch.
- SBOM (syft) y firma (cosign).

---

## 14. Runbook Operativo (Inicial)

| Síntoma                              | Verificar                                  | Mitigación |
|-------------------------------------|---------------------------------------------|------------|
| Ocupación siempre vacía             | Clave Redis occupancy_<camera>              | Revisar escritura de processing_service |
| Alta latencia de inferencia         | Uso CPU/GPU / tamaño de frame               | Reducir FPS o cambiar a modelo ligero |
| Desconexiones frecuentes WS video   | Timeouts gateway / token                    | Ajustar timeouts, renovar token |
| Token válido tras logout            | Consulta de blacklist                       | Confirmar query jti y coherencia DB |
| Congelación de cámara               | Logs video_stream_service                   | Reintentar captura / watchdog |

---

## 15. Checklist de Hardening

- [ ] Eliminar secretos expuestos en docker-compose.yml
- [ ] Revocar y rotar PAT filtrado
- [ ] Añadir rate limiting (NGINX)
- [ ] Habilitar TLS + HSTS
- [ ] Logging estructurado JSON
- [ ] Endpoints /healthz y /ready
- [ ] Instrumentación OpenTelemetry
- [ ] Endpoint /version (commit + model hash)
- [ ] Gestión de secretos (Vault / AWS/GCP Secret Manager)
- [ ] Validación consistente de parámetros (email, camera_id, roles)
- [ ] Cabeceras CSP / X-Frame-Options / Referrer-Policy

---

## 16. Extensibilidad

Elementos sustituibles o ampliables:
- Modelo de detección (interfaz para cargar pesos).
- Loader de definición de plazas (JSON recargable).
- Publicación de eventos (Kafka / NATS).
- Filtros de privacidad (blur dinámico).
- Multi-tenant (prefijo en claves Redis: tenant:camera).

---

## 17. Inconsistencias / Acciones

| Issue | Observado | Acción |
|-------|-----------|--------|
| Mismatch endpoint login | Tests usan /token vs /login | Añadir alias /token o actualizar tests |
| Nombres env dispares | DATABASE_URL vs DB_URL | Estandarizar (DATABASE_URL) |
| Secretos expuestos | PAT + credenciales compose | Migrar a secretos externos |
| Falta doc de MODEL_PATH | No centralizado | Documentar y validar al arranque |
| Sin health endpoints | Ausente | Implementar /healthz /ready |
| Reconexión ingestión frágil | Lógica no mostrada | Añadir reintentos/backoff |

---

## 18. Contribución

1. Rama: `feature/<nombre-corto>`
2. Commits atómicos (Conventional Commits: `feat:`, `fix:`, `perf:`, `security:`).
3. Añadir/actualizar pruebas.
4. Excluir secretos.
5. PR con: contexto, impacto rendimiento, consideraciones seguridad.

Herramientas recomendadas:
- Ruff / Black / isort (Python)
- ESLint / Prettier (Frontend)
- pre-commit hooks

---

## 19. Privacidad

- Restringir video crudo (solo roles elevados).
- En producción regulada: difuminar matrículas y áreas sensibles.
- Sin almacenamiento persistente de frames por defecto; definir retención si se habilita.

---

## 20. Licencia

MIT License — ver archivo LICENSE.

---

## 21. Resumen Ejecutivo

FindParking ofrece un pipeline modular y consciente de roles que transforma video en métricas estructuradas de ocupación con mínima latencia. Los límites de servicio (auth, inferencia, estado, streaming, UI) permiten escalado independiente y endurecimiento específico. Con pequeñas incorporaciones (observabilidad, gestión de secretos, alineación de endpoints) el sistema se encuentra listo para un proceso de endurecimiento hacia producción y futuras expansiones (multi-inquilino, analítica avanzada, ocupación predictiva).

---

## 22. Apéndice (Próximos Pasos Sugeridos)

Corto Plazo (0–2 sprints):
- Alinear endpoint login y tests.
- Logging estructurado + endpoints de salud.
- Eliminar y rotar secretos filtrados.
- Métricas básicas + exportador Prometheus.

Mediano Plazo (2–5 sprints):
- Trazas, rate limiting, filtros de privacidad.
- Pruebas de regresión de rendimiento.
- Selección canaria de modelos.
- Orquestación (Kubernetes) y autoscaling.

Largo Plazo:
- Servicio de analítica histórica (TSDB).
- Modelo predictivo de ocupación temporal.
- Perfil edge (footprint reducido).
- Redundancia multi-región y failover.

---
