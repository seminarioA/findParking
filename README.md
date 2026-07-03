```
    _______           ______             __   _            
   / ____(_)___  ____/ / __ \____ ______/ /__(_)___  ____ _
  / /_  / / __ \/ __  / /_/ / __ `/ ___/ //_/ / __ \/ __ `/
 / __/ / / / / / /_/ / ____/ /_/ / /  / ,< / / / / / /_/ / 
/_/   /_/_/ /_/\__,_/_/    \__,_/_/  /_/|_/_/_/ /_/\__, /  
                                                  /____/ 
```

<p align="center"><b>Detección de ocupación de estacionamientos en tiempo real a partir de streams de video, con Computer Vision.</b></p>

<p align="center">
  <img src="https://github.com/seminarioA/findParking/actions/workflows/ci-cd-pipeline.yml/badge.svg" alt="CI/CD Pipeline">
  <img src="https://img.shields.io/badge/Computer_Vision-purple" alt="Computer Vision">
  <img src="https://img.shields.io/badge/Machine_Learning-blue" alt="Machine Learning">
  <img src="https://img.shields.io/badge/Artificial_Inteligence-green" alt="Artificial Intelligence">
  <img src="https://img.shields.io/badge/Object_Detection-yellow" alt="Object Detection">
  <img src="https://img.shields.io/badge/MLOps-red" alt="MLOps">
  <img src="https://img.shields.io/badge/YoloV11-orange" alt="Yolov11">
</p>

<table align="center">
  <tr>
    <td align="center">
      <sub><b>Frontend</b></sub><br/>
      <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FseminarioA%2FfindParking&root-directory=ui%2Ffrontend&project-name=findparking-frontend&repository-name=findparking-frontend">
        <img src="https://vercel.com/button" alt="Deploy Frontend with Vercel">
      </a>
    </td>
    <td align="center">
      <sub><b>Backend (solo auth)</b></sub><br/>
      <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FseminarioA%2FfindParking&root-directory=api%2Fauth&project-name=findparking-auth-api&repository-name=findparking-auth-api">
        <img src="https://vercel.com/button" alt="Deploy Backend (auth service) with Vercel">
      </a>
    </td>
  </tr>
</table>

<p align="center">
  <sub>El botón de <b>Backend</b> despliega únicamente el servicio <code>api/auth</code> como funciones serverless (necesita configurar <code>DATABASE_URL</code>/<code>SECRET_KEY</code>/<code>JWT_SECRET</code> en Vercel después de importar, apuntando a un Postgres externo). Los demás servicios (occupancy, video, vision) usan WebSockets/Redis y <b>no</b> corren en el modelo serverless de Vercel — para el stack completo, usa el VPS con Docker Compose (ver <a href="#despliegue-cicd">Despliegue</a>).</sub>
</p>

![findParking preview on desktop, tablet and mobile](docs/hero-banner.png)

## Tabla de contenido

- [Acerca de](#acerca-de)
- [Arquitectura](#arquitectura)
- [Stack](#stack)
- [Quickstart](#quickstart)
- [Variables de entorno](#variables-de-entorno)
- [Testing](#testing)
- [Despliegue (CI/CD)](#despliegue-cicd)
- [Contribuyentes](#contribuyentes)
- [Licencia](#licencia)

## Acerca de

FindParking es una plataforma que determina la ocupación de plazas de estacionamiento (libre / ocupada) a partir de streams de video, usando técnicas de Visión por Computadora (YOLO + OpenCV).

Técnicamente, captura frames de cámaras configuradas, ejecuta detección de vehículos, mapea las detecciones a plazas definidas y expone la ocupación actual mediante REST y WebSockets.

## Arquitectura

La base de código está organizada como un **monolito modular**, agrupando responsabilidades por dominio:

```
findParking/
├── infra/        # Docker Compose, gateway y despliegue
├── api/          # Módulos de autenticación, ocupación y video
├── vision/       # Procesamiento de video y streaming
├── core/         # Recursos compartidos (modelos, videos, configuraciones)
├── metrics/      # Punto de entrada para observabilidad/monitorización
├── ui/           # Frontend React
├── docs/         # Documentación UML y diagramas
└── tests/        # Pruebas de contrato e integración ligera
```

Diagramas detallados (paquetes, clases y microservicios) en [`docs/`](docs/):
- [Diagrama de microservicios](docs/microservices_diagram.drawio)
- [Diagrama de clases](docs/Diagrama%20de%20Clases.drawio)
- [Info de diagrama de paquetes UML](docs/uml_package_diagram_info.md)
- [Info de diagrama de clases UML](docs/uml_class_diagram_info.md)
- [Wiki: CI/CD Pipeline (diagramas de arquitectura tecnológica y gobernanza)](https://github.com/seminarioA/findParking/wiki/CI-CD-Pipeline)

## Stack

### IA/ML
![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white)

### Back-End
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3)
![PyPi](https://img.shields.io/badge/pypi-%23ececec.svg?style=for-the-badge&logo=pypi&logoColor=1f73b7)

### Bases de datos
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

### Front-End
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

### DevOps
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Bash Script](https://img.shields.io/badge/bash_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

### Cloud
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)

## Quickstart

### Instalación manual (Linux/WSL)

Por reproducibilidad, las imágenes de los microservicios se construyen **una sola vez en CI** (ver [Despliegue (CI/CD)](#despliegue-cicd)) y se publican en GHCR. El VPS (o tu máquina) solo las **descarga y las corre**, nunca las reconstruye localmente — así la imagen que corre en producción es exactamente la misma que pasó los tests.

```bash
# 1. Instalar git, Docker y el plugin de Docker Compose
sudo apt update && sudo apt install -y git docker.io docker-compose-plugin

# 2. Clonar repositorio
git clone https://github.com/seminarioA/findParking.git
cd findParking/infra

# 3. (Solo si los packages de GHCR aun son privados) autenticarse con un
#    Personal Access Token con scope read:packages
echo "$GHCR_TOKEN" | sudo docker login ghcr.io -u "$GHCR_USER" --password-stdin

# 4. Descargar las imagenes ya construidas en CI y levantarlas (nunca --build)
sudo docker compose -f docker-compose.yml pull
sudo docker compose -f docker-compose.yml up -d
```

### Instalación automática (Linux/WSL)

[`infra/deploy.sh`](infra/deploy.sh) hace exactamente lo mismo (clona, hace `pull` y levanta con `up -d`, sin reconstruir nada):

```bash
./infra/deploy.sh
```

### Acceso al servicio

- Frontend: `http://<ip pública/localhost>` (puerto 80, vía el gateway de nginx)

## Variables de entorno

Cada servicio incluye su propio `.env.example` como plantilla — cópialo a `.env` (gitignored) y completa los valores reales antes de levantar el stack:

| Servicio | Archivo | Variables clave |
| --- | --- | --- |
| Infra (Postgres) | [`infra/.env.example`](infra/.env.example) | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |
| Auth | [`api/auth/.env.example`](api/auth/.env.example) | `SECRET_KEY`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `DB_URL` |
| Occupancy | [`api/occupancy/.env.example`](api/occupancy/.env.example) | `SECRET_KEY`, `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB` |
| Video | [`api/video/.env.example`](api/video/.env.example) | `JWT_SECRET`, `SECRET_KEY`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB` |

`SECRET_KEY`/`JWT_SECRET` deben ser el mismo valor en los tres servicios de `api/`, ya que comparten la validación de tokens JWT.

## Testing

Los tests bajo [`tests/`](tests/) son unitarios y aislados: usan `TestClient` de FastAPI directamente sobre cada app (sin stack en vivo), con Redis mockeado y una base sqlite temporal para auth.

```bash
pip install -r api/auth/requirements.txt -r api/occupancy/requirements.txt -r api/video/requirements.txt pytest httpx
pytest tests/ -v
```

Cobertura actual: autenticación (`test_auth.py`), ocupación (`test_occupancy.py`), video vía WebSocket (`test_video_ws.py`, `test_video_spmc.py`).

## Despliegue (CI/CD)

El workflow [`ci-cd-pipeline.yml`](.github/workflows/ci-cd-pipeline.yml) corre en cada push/PR a `main`, `dev` y `test`:

1. **Run Backend Unit Tests (pytest)** — siempre.
2. **Build & Push Docker Images to GHCR** — solo en push a `main`; construye y publica cada `Dockerfile` del repo en GitHub Container Registry (`ghcr.io`), autenticando con el `GITHUB_TOKEN` automático (sin secretos manuales), con el nombre de imagen que `infra/docker-compose.yml` espera.
3. **Deploy to Production via SSH** — solo en push a `main` y con la variable de repo `DEPLOY_ENABLED=true`; hace `docker compose pull/up` en el host de producción.

El frontend (`ui/frontend`) se puede desplegar de forma independiente en Vercel con el botón de arriba.

## Contribuyentes

### 🧑🏻‍🔬 Alejandro Seminario
![Computer Vision Engineer](https://img.shields.io/badge/Computer_Vision_Egineer-purple)
![MLOps](https://img.shields.io/badge/MLOps-red)
![Machine Learning Tech Lead](https://img.shields.io/badge/ML;TL-Machine_Learning_Tech_Lead-blue)

[![LinkedIn][1]][2] [![GitHub][3]][4]

[1]: https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white
[2]: https://www.linkedin.com/in/alejandroseminariomedina/
[3]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[4]: https://github.com/seminarioA

## Licencia

Este proyecto todavía no define una licencia open-source formal. Contacta al mantenedor antes de reutilizar el código fuera de este repositorio.

---

```
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⣄⢻⣆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣷⣿⣿⣿⣿⢹⡗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣇⠈⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⡿⡆⠀⠈⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣾⣿⣦⠀⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣏⣿⣿⣽⡀⠀⠘⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣸⣿⣿⣿⣿⣿⣄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣇⢲⡀⠈⢻⡦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠇⣸⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⠷⢻⣿⣌⣿⡆⢸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⡏⣵⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣧⡼⣹⡿⢸⣧⠀⠙⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣼⣾⡟⠉⣭⣿⣿⣭⣿⣿⣿⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣧⡟⣠⡼⢿⠆⠀⠘⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⣲⣦⣤⣤⣀⡀⠀⠀⠀⠀⢀⣠⣿⢹⠹⠁⢲⣿⣿⣿⣾⣿⣿⡿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣼⣿⣧⣾⣷⠒⠶⢿⣭⣿⠿⠿⢶⣾⡻⠋⠾⠟⠙⠿⠗⠒⣻⣿⣿⣶⣶⡶⣾⣿⡿⡾⠈⣰⣴⡿⣿⣷⣿⣿⣿⡿⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⡟⠛⢒⣤⡄⠉⠽⠶⠤⠄⠈⢉⣀⣐⣚⡛⠓⠒⠛⠻⠀⠀⢀⣿⣦⣭⡞⣤⣶⣾⣿⣿⠻⣦⣿⣿⣿⠟⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⢛⣿⡿⢟⣿⡿⢿⣿⣿⣿⣿⠿⢰⢾⣿⣿⣾⠧⠤⢄⠴⠾⠿⣥⡤⠤⠀⢠⣄⣀⣀⠘⣷⡀⢣⣍⣉⠀⠀⠘⠻⣿⣄⣠⡟⢿⣿⣿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣶⣿⢏⣴⡾⠛⠑⣿⣟⣑⠿⣿⣶⣾⢷⡻⣏⠀⠀⠶⠛⢶⣶⠶⠶⣤⣀⠀⢞⣉⠈⠛⠒⠿⠷⠾⣶⣧⣀⠀⠀⢀⣬⣥⢙⣿⣿⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣿⢟⣡⣿⣿⠟⣿⠻⠋⠀⣠⣼⡿⢿⣯⣀⠙⢿⣷⡶⣿⣿⣦⠀⠀⠀⠁⢀⠾⠋⠙⠛⠉⠹⠤⠶⣿⣷⣦⡠⢬⣛⡿⢳⠖⠋⠁⢹⣾⣿⣿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⠟⣿⣾⡿⢠⣤⣾⡿⠛⠦⣤⣀⠙⢷⣾⣿⣾⣾⣿⣿⣧⣤⡀⠀⠀⠀⠀⢸⠃⠀⠀⠀⠀⠀⠚⠋⠀⠴⣏⠳⡄⠀⣀⣤⠼⣛⡿⣿⣿⡄⠀⠀⠀⠀⠀
⠀⠀⠀⢠⡾⢿⠉⣿⣿⠏⡰⠿⠋⠀⢠⣿⣟⠛⣲⣶⡶⠼⣉⠙⣶⡯⠋⠀⢀⣀⣈⡉⠛⢷⣦⣀⠀⠘⣧⡀⠀⠀⠀⠀⠐⠮⠁⠀⠉⢀⣰⡾⠷⣶⣿⡟⢛⣡⢸⡇⠀⠀⠀⠀⠀
⠀⠀⢠⣿⣷⣾⣿⣿⣿⡼⠁⡶⠀⠀⣼⡿⠃⠒⠒⠒⠂⣠⣬⣿⡏⠀⠀⢠⣿⣭⣽⣿⡆⠀⢹⣿⣿⣷⠳⣵⠀⠀⠀⠀⢀⡀⠀⣀⣠⣾⢿⣦⠀⠹⣿⣗⣉⣿⢸⡇⠀⠀⠀⠀⠀
⠀⠀⣼⣿⡟⡽⡟⣠⣿⢧⡜⠁⢨⣿⣿⣛⣀⣀⠀⢀⣸⡿⢚⣿⡇⠀⠀⠈⣿⣿⣿⣿⡏⠀⠀⢿⣿⣿⠀⠈⠛⢦⡴⠀⠘⠛⠋⠁⣼⣷⣾⣿⠀⠀⢿⡛⠒⠛⠈⡇⠀⠀⠀⠀⠀
⠀⣰⣿⢿⣹⡇⢸⡏⣿⠸⠁⠀⠀⣿⣟⣓⠶⠦⠀⢀⣀⣀⢽⣞⣻⣆⠀⠀⠈⠙⠛⠋⠀⣀⣤⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⠿⠟⠀⠀⣾⢍⣻⡂⠀⡇⠀⠀⠀⠀⠀
⠀⣿⣿⣸⣿⣧⣼⠀⣿⠀⠀⠀⠀⢿⣿⣧⡴⢖⣚⣭⠽⢷⣾⣯⡭⠙⠻⣶⣤⣀⣤⣶⠾⣋⣿⣿⠟⠁⠀⠲⠦⣴⣶⣦⠀⠀⠀⠀⠘⣇⡀⠀⣀⣼⢯⣄⡉⢉⣤⡇⠀⠀⠀⠀⠀
⢠⣿⣿⡏⢸⡟⣿⠀⠀⠀⠀⠀⢀⠈⠻⣿⣶⡟⠉⣯⣤⣾⣻⡥⢶⣾⡼⠁⣀⣭⣤⣾⡿⠟⠋⠀⠀⠀⠀⠀⠀⢰⣿⣿⣇⠀⠀⠀⠀⠘⠛⢿⣿⠀⣩⡟⠧⡿⢸⡇⠀⠀⠀⠀⠀
⢸⣿⣿⣿⡟⠀⠿⠀⠀⠀⠀⠀⠻⣷⣶⣾⣿⣡⣤⡞⠉⠛⠛⠟⣡⡴⠿⠛⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣷⣿⡆⠀⠀⠀⠀⠀⠀⠹⣿⣯⣙⠲⠖⣼⡇⠀⠀⠀⠀⠀
⢸⣿⣶⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣡⣾⣟⣶⠿⢧⣠⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣆⣀⣮⣿⣿⣹⣿⣇⠀⢠⠀⠀⠀⠰⣤⣌⢻⣌⡿⣶⣿⠇⠀⠀⠀⠀⠀
⢸⠛⣯⠋⠟⠀⠀⠀⠀⠀⠀⠀⠀⠘⢫⣿⠛⢻⣿⣯⣴⣿⢚⠋⠁⠰⠶⠿⡶⡇⠀⠀⠀⢠⡄⢠⡄⣷⣿⣹⣿⣿⣿⣇⠘⢿⠀⠈⠃⢀⡀⠘⢮⣿⣳⣿⣇⣿⡿⠀⠀⠀⠀⠀⠀
⣾⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠋⠉⠙⠛⠋⠸⣷⣬⢷⡦⠀⢀⣀⠀⠀⠀⠛⠿⣷⣿⣿⣿⣿⣿⣿⣿⣿⡆⢸⠃⠀⠀⠈⠷⠳⠀⠙⣃⣼⣿⣿⣧⡀⠀⠀⠀⠀⠀
⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣰⣞⠿⣶⡘⢿⣷⣦⣲⣄⠀⠈⠙⠾⣿⢿⣿⡿⣿⣿⢡⡏⠀⠀⠀⠀⠀⠀⠀⣸⢯⣍⠙⠻⢿⡇⠀⠀⠀⠀⠀
⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠘⠛⠋⢳⣤⡙⢷⡾⣿⣧⣄⠀⠀⠈⢣⡙⠟⠛⣿⡿⠁⠀⠀⠀⠀⠀⠀⣠⣟⡛⠁⠀⠀⢸⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠘⠧⣻⣌⠻⣌⢃⣀⠀⢀⠙⠂⠀⠋⠀⢀⡠⠞⢿⣓⣿⡿⢿⡿⠛⠃⠤⢤⣠⣇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠙⠿⠦⠹⣷⣍⡳⣞⠷⡄⠀⢠⣤⣾⣶⣷⢿⣿⣟⣻⣶⣤⡀⠀⠲⣄⡈⢿⣷⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⠳⣭⡙⠓⠤⠀⠀⠀⢦⣀⠀⠀⠀⠀⠈⠛⠙⠻⢷⡯⣦⡉⠙⢿⣿⠿⣷⠮⠽⠿⠿⣿⠻⢦⣄⣈⡙⢻⣿⣧⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣙⣛⣿⡇⠀⠀⠀⠀⠀⡀⠙⢷⣤⣦⡀⠀⠀⠀⠀⠀⠙⢮⣿⣿⣆⡙⢷⣀⡀⠀⠀⠀⢈⡀⣤⡈⣧⡙⢳⡜⣿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠋⠁⠀⠀⠀⠀⠀⠙⣦⣈⡉⣾⣿⣷⣶⠀⡀⠀⢶⡶⢿⣿⣯⠁⠀⢧⡙⢲⡤⣤⣈⢻⣿⣿⣿⠁⠈⠑⢸⣆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢶⣷⣤⣿⣿⣿⡿⠛⠁⢠⡇⠲⣾⣷⣿⣿⣷⣀⠀⣦⠙⢦⠙⠙⠫⢿⣿⣿⣿⣧⣤⣈⣉⣿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⡿⠿⢧⠀⠀⢸⣅⡓⣶⣽⣿⣿⡾⣘⣦⠈⣿⣿⣧⠄⠀⠀⢹⡿⢿⣿⠟⠋⢁⣿⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢓⡶⣦⠀⠙⠿⠞⠀⠀⠀⠈⠹⡿⢿⣿⡾⠿⠟⠙⠈⠉⢀⣤⣶⣤⠾⠉⢴⣟⣁⣤⣬⣉⣙⣷⢀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠡⢤⣽⠃⣘⡁⠀⠀⠀⠈⠉⠉⠀⠀⠀⣠⠟⢉⣍⣉⠉⢙⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⣤⣤⠤⢀⣒⠒⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠻⡿⠃⣾⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢉⢻⠶⡃⣠⣶⡾⠇⡏⠀

"ὦ παῖ, γλαυκῶπις Ἀθάνα σοὶ ξυμμαχεῖ."
- Esquilo, Eumenides v. 995. Ed. H. Weir Smyth, Aeschyli Tragoediae, Oxford Classical Texts, 1926.
```
