
# FindParking

Sistema de visión por computadora para detección en tiempo real de espacios de estacionamiento, basado en microservicios, Docker y buenas prácticas de producción.

---

## 🚗 Arquitectura de Producción

### Microservicios

- **frontend_service**: Interfaz web para usuarios, consume los servicios de ocupación y video.
- **auth_service**: Autenticación y emisión de JWT.
- **occupancy_service**: Consulta y gestión de ocupación de espacios.
- **video_service**: Streaming y procesamiento de video (WebSocket).
- **processing_service**: Detección de vehículos con YOLO/OpenCV y publicación en Redis.
- **api_gateway (NGINX)**: Proxy reverso, balanceo y seguridad.
- **redis**: Almacenamiento temporal y cache.

### Flujo de Integración

1. El usuario accede al frontend y se autentica en `/api/auth/token` para obtener un JWT.
2. El frontend consume endpoints protegidos vía API Gateway, enviando el JWT en cada request y WebSocket.
3. Los microservicios validan el JWT y responden según el rol y permisos.
4. Redis centraliza datos de video y ocupación.

### Despliegue en Producción

```bash
docker-compose up --build
```

- Todos los servicios se levantan en contenedores aislados.
- El API Gateway enruta y protege los endpoints.
- Redis persiste datos y permite escalabilidad.
- El frontend se comunica solo vía API Gateway.

---

## 🔒 Seguridad y Buenas Prácticas

- JWT para autenticación y autorización en todos los servicios.
- Variables de entorno para credenciales y secretos.
- Certificados SSL y HTTPS (configurables en NGINX).
- Actualización periódica de dependencias.
- Pruebas automáticas con pytest y requests.
- Logging centralizado y monitoreo (recomendado: Prometheus, Grafana).
- Separación estricta de responsabilidades por microservicio.

---

## 📦 Estructura del Proyecto

```
findParking/
├── services/
│   ├── auth_service/
│   ├── occupancy_service/
│   ├── video_service/
│   ├── processing_service/
│   ├── frontend_service/           # Nuevo microservicio web
│   └── api_gateway/
├── resources/
├── templates/
├── docker-compose.yml
├── README.md
└── tests/
```

---

## 🐳 Despliegue y Escalabilidad

- Escala cada microservicio de forma independiente.
- Balanceo y proxy con NGINX.
- Redis persistente para cache y colas.
- Listo para múltiples cámaras y clientes concurrentes.
- Recomendado: migrar a Kubernetes para alta disponibilidad.

---

## 🧪 Pruebas Automáticas

Ejecuta todos los tests:

```bash
pytest tests/
```

Incluye pruebas de endpoints REST, WebSocket y templates.

---

## 🧠 Personalización y Extensión

- Modifica `resources/parking1.mp4` y `coco.txt` según tu caso.
- Entrena tu propio modelo YOLO y reemplaza `yolo11n.pt`.
- Edita templates HTML y frontend para roles y vistas personalizadas.
- Agrega nuevos microservicios según necesidades.

---

## 🌐 Frontend de Producción

El microservicio `frontend_service` permite:

- Autenticación de usuarios y gestión de JWT.
- Visualización en tiempo real del estado de ocupación (vía `occupancy_service`).
- Streaming de video procesado y crudo (vía WebSocket a `video_service`).
- Interfaz responsiva y segura, protegida por el API Gateway.

---

## 📜 Licencia

MIT License © [Los Andes Labs](https://github.com/TU_USUARIO)
