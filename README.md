# FindParking
[//]: # (Microservicios y Flujo de Integración)

## Arquitectura Microservicios

### Flujo de Integración

1. **Cliente Frontend** solicita autenticación en `/api/auth/token` y recibe un JWT.
2. El JWT se envía en cada request (header `Authorization: Bearer <token>`).
3. El API Gateway (NGINX) enruta las peticiones:
   - `/api/video/{camera_id}/processed` y `/api/video/{camera_id}/raw` → `video_service` (WebSocket, JWT requerido)
   - `/api/occupancy/{camera_id}` → `occupancy_service` (REST, JWT requerido)
   - `/api/auth/token` → `auth_service` (REST)
4. Los microservicios validan el JWT antes de responder.
5. `video_service` y `occupancy_service` obtienen datos de Redis.
6. El frontend consume los endpoints protegidos y muestra video y ocupación en tiempo real.

### Ejemplo de Frontend (adaptado para múltiples cámaras)

```js
// Autenticación y obtención de JWT
async function login(username, password) {
  const res = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}`
  });
  const data = await res.json();
  return data.access_token;
}

// WebRTC para video procesado
async function startWebRTC(camera_id, token) {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const wsUrl = wsProtocol + window.location.host + `/api/video/${camera_id}/processed`;
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ Authorization: `Bearer ${token}` }));
  };
  ws.onmessage = (event) => {
    // Procesa el frame recibido
  };
}

// REST para ocupación
async function fetchOccupancy(camera_id, token) {
  const res = await fetch(`/api/occupancy/${camera_id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
}
```

### Despliegue

- Ejecuta `docker-compose up --build` para levantar todos los servicios y Redis.
- El API Gateway enruta y protege los servicios.
- El frontend debe consumir los endpoints usando JWT.

### Seguridad y Escalabilidad

- Cada microservicio puede escalarse de forma independiente.
- El API Gateway puede balancear carga y gestionar certificados SSL.
- Redis centraliza el almacenamiento de frames y ocupación.
- El sistema está listo para múltiples cámaras y clientes concurrentes.

**FindParking** es un sistema de visión por computadora para detección en tiempo real de espacios de estacionamiento disponibles u ocupados, basado en YOLO y OpenCV. Diseñado bajo una arquitectura **MVC**, cuenta con interfaz web diferenciada para administradores y usuarios finales.

---

## 📸 Demo Visual

- ![Vista Administrador](https://i.imgur.com/3lJXzK2.png)
- ![Vista Usuario](https://i.imgur.com/xqNcyLV.gif)

---

## 🧠 Características Principales

- 🔎 Detección en vivo de vehículos con YOLO.
- 🅿️ Asignación dinámica de espacios ocupados/libres mediante coordenadas poligonales.
- 🌐 Interfaz web diferenciada por rol:
  - **Administrador**: Visualiza video en tiempo real con bounding boxes.
  - **Usuario**: Visualiza estado simplificado por íconos.
- 📁 Arquitectura **Modelo–Vista–Controlador (MVC)**.
- 🐳 Listo para despliegue con Docker.

---

## 📂 Estructura del Proyecto

```
FindParking/
├── app/
│   ├── templates/         # HTML por rol
│   ├── static/            # CSS, íconos, JS
│   ├── camera.py          # Lógica de video y detección
│   ├── utils.py           # Utilitarios: modelo, coordenadas, detección
│   ├── routes.py          # Controlador (Blueprints Flask)
│   └── main.py            # Inicialización y configuración Flask
├── modelo/
│   ├── yolo11n.pt         # Modelo YOLO entrenado o preentrenado
│   └── coco.txt           # Clases YOLO
├── coordenadas/
│   └── espacios.json      # Coordenadas poligonales de los espacios
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## ⚙️ Instalación Local

```bash
git clone https://github.com/TU_USUARIO/findparking.git
cd findparking

# Crea entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instala dependencias
pip install -r requirements.txt

# Ejecuta la app
python app/main.py
```

---

## 🐳 Despliegue con Docker

```bash
docker build -t findparking .
docker run -p 5000:5000 findparking
```

---

## 🧪 Requisitos

- Python ≥ 3.9
- OpenCV ≥ 4.5
- Flask
- Ultralytics YOLO (v8.x)
- CUDA (opcional, para aceleración)

---

## 🔧 Personalización

- Edita las coordenadas de los espacios en `coordenadas/espacios.json`.
- Sustituye `parking1.mp4` por tu fuente: cámara IP, webcam o nuevo video.
- Añade nuevas vistas HTML para escalar roles o funcionalidades.

---

## 🧱 Roadmap (Propuesto)

- [ ] Entrenamiento personalizado de YOLO con dataset propio.
- [ ] Dashboard estadístico para monitoreo histórico.
- [ ] Modo nocturno y condiciones adversas.
- [ ] Exportación CSV/JSON de registros de ocupación.

---

## 🤝 Contribuciones

Pull Requests y mejoras son bienvenidas. Si encuentras un bug o deseas proponer una mejora, abre un [issue](https://github.com/TU_USUARIO/findparking/issues).

---

## 📜 Licencia

MIT License © [Los Andes Labs](https://github.com/TU_USUARIO)

---
