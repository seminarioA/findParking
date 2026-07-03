```
    _______           ______             __   _            
   / ____(_)___  ____/ / __ \____ ______/ /__(_)___  ____ _
  / /_  / / __ \/ __  / /_/ / __ `/ ___/ //_/ / __ \/ __ `/
 / __/ / / / / / /_/ / ____/ /_/ / /  / ,< / / / / / /_/ / 
/_/   /_/_/ /_/\__,_/_/    \__,_/_/  /_/|_/_/_/ /_/\__, /  
                                                  /____/ 
```

##
![Computer Vision](https://img.shields.io/badge/Computer_Vision-purple)
![Machine Learning](https://img.shields.io/badge/Machine_Learning-blue)
![Artificial Intelligence](https://img.shields.io/badge/Artificial_Inteligence-green)
![Object Detection](https://img.shields.io/badge/Object_Detection-yellow)
![MLOps](https://img.shields.io/badge/MLOps-red)
![Yolov11](https://img.shields.io/badge/YoloV11-orange)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FseminarioA%2FfindParking&root-directory=ui%2Ffrontend&project-name=findparking-frontend&repository-name=findparking-frontend)

![findParking preview on desktop, tablet and mobile](docs/hero-banner.png)

## 🦉 FPKv0.5

FindParking es una plataforma que permite determinar la ocupación de plazas de estacionamiento (libre / ocupada) a partir de streams de video. Para ello, hace uso de tecnicas de Vision por Computadora (IA).

## Tabla de Contenido
- [Acerca de](#-acerca-de)
- [Instalación](#-instalación)
  - [Instalación manual](#instalación-manual)
  - [Instalación automatica](#instalación-automatica-linuxwsl)
- [Stack](#-stack)
- [Contribuyentes](#-contribuyentes)

## 👩🏻‍💻 Acerca de
Tecnicamente, FindParking captura frames de cámaras configuradas, ejecuta detección de vehículos con YOLO + OpenCV, mapea detecciones a plazas definidas y expone la ocupación actual mediante REST y WebSockets.

### 🧩 Monolito modular
La base de código se reorganizó como un monolito modular para agrupar responsabilidades:
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

## 👩🏻‍🔬 Instalación

¡Existen dos maneras!

### Instalación manual (Linux/WSL)

#### Instalar git
```bash
sudo apt update
sudo apt install git
```

#### Clonar repositorio
```bash
git clone https://github.com/seminarioA/findParking.git
```

#### Abrir Carpeta
```bash
cd findParking
cd infra
```

#### Levantar microservicios

```bash
docker-compose -f docker-compose.yml up --build
```

### Instalación automatica (Linux/WSL)

#### Ejecutar el script
```bash
./infra/deploy.sh
```

### ¿Y como accedo al servicio?
El punto de acceso es:
- Frontend: http://<ip publica/localhost>:3000

## 💻 Stack

### IA/ML
![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white)

### Back-End
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3)
![PyPi](https://img.shields.io/badge/pypi-%23ececec.svg?style=for-the-badge&logo=pypi&logoColor=1f73b7)

### Bases de Datos
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

## 👩🏻‍🔬 Contribuyentes
### 🧑🏻‍🔬 Alejandro Seminario
![Computer Vision Engineer](https://img.shields.io/badge/Computer_Vision_Egineer-purple)
![MLOps](https://img.shields.io/badge/MLOps-red)
![Machine Learning Tech Lead](https://img.shields.io/badge/ML;TL-Machine_Learning_Tech_Lead-blue)

Redes:

[![LinkedIn][1]][2] [![GitHub][3]][4]

[1]:  https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white
[2]:  https://www.linkedin.com/in/alejandroseminariomedina/

[3]:  https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[4]:  https://github.com/seminarioA


##

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
