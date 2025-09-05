```
    _______           ______             __   _            
   / ____(_)___  ____/ / __ \____ ______/ /__(_)___  ____ _
  / /_  / / __ \/ __  / /_/ / __ `/ ___/ //_/ / __ \/ __ `/
 / __/ / / / / / /_/ / ____/ /_/ / /  / ,< / / / / / /_/ / 
/_/   /_/_/ /_/\__,_/_/    \__,_/_/  /_/|_/_/_/ /_/\__, /  
                                                  /____/ 
```                                                  
--------------------------------------------------------------------------------

FindParking es una plataforma de visión por computadora en tiempo real para determinar ocupación de plazas de estacionamiento (libre / ocupada) a partir de streams de video.
---

## Mas acerca de FindParking

## 1. Descripción General

FindParking captura frames de cámaras configuradas, ejecuta detección de vehículos con YOLO + OpenCV, mapea detecciones a plazas definidas y expone la ocupación actual mediante REST y WebSockets. Objetivos de diseño:

## Instalacion

### Clonar repositorio

### Levantar microservicios

```bash
docker-compose up --build
```

Punto de acceso:
- Frontend: http://<ip publica/localhost>:3000
