# FindParking

Sistema de visión por computadora para detección en tiempo real de espacios de estacionamiento, basado en microservicios, Docker y buenas prácticas de producción.

---

## 🚗 Arquitectura de Producción

### Microservicios

- **auth_service**: Autenticación y emisión de JWT.
- **occupancy_service**: Consulta y gestión de ocupación de espacios.
- **video_service**: Streaming y procesamiento de video (WebSocket).
- **processing_service**: Detección de vehículos con YOLO/OpenCV.
- **api_gateway (NGINX)**: Proxy reverso, balanceo y seguridad.
- **redis**: Almacenamiento temporal y cache.

### Flujo de Integración

1. El usuario se autentica en `/api/auth/token` y recibe un JWT.
2. El frontend consume endpoints protegidos vía API Gateway, enviando el JWT en cada request.
3. Los microservicios validan el JWT y responden según el rol y permisos.
4. Redis centraliza datos de video y ocupación.

### Despliegue en Producción

```bash
docker-compose up --build
```

- Todos los servicios se levantan en contenedores aislados.
- El API Gateway enruta y protege los endpoints.
- Redis persiste datos y permite escalabilidad.

---

## 🔒 Seguridad y Buenas Prácticas

- JWT para autenticación y autorización.
- Variables de entorno para credenciales y secretos.
- Certificados SSL y HTTPS (configurables en NGINX).
- Actualización periódica de dependencias.
- Pruebas automáticas con pytest y requests.
- Logging centralizado y monitoreo (recomendado: Prometheus, Grafana).

---

## 📦 Estructura del Proyecto

```
findParking/
├── services/
│   ├── auth_service/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── occupancy_service/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── video_service/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── processing_service/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── api_gateway/
│       └── nginx.conf
├── resources/
│   ├── yolo11n.pt
│   ├── coco.txt
│   └── parking1.mp4
├── templates/
│   ├── admin_view.html
│   ├── login.html
│   └── user_view.html
├── docker-compose.yml
├── README.md
└── tests/
    ├── test_auth.py
    ├── test_occupancy.py
    ├── test_video_ws.py
    ├── test_gateway.py
    └── test_templates.py
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
- Edita templates HTML para roles y vistas personalizadas.
- Agrega nuevos microservicios según necesidades.

---

## 📜 Licencia

MIT License © [Los Andes Labs](https://github.com/TU_USUARIO)
