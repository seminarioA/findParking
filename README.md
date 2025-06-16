# FindParking

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
