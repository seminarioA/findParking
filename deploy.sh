#!/bin/bash
# Script para instalar Docker, Docker Compose y desplegar tu app en Ubuntu EC2

set -e

# Actualiza el sistema
sudo apt update && sudo apt upgrade -y

# Instala Docker y Docker Compose
sudo apt install -y docker.io docker-compose

# Habilita Docker y agrega el usuario actual al grupo docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# (Opcional) Instala git si vas a clonar tu repo
sudo apt install -y git

# Crea carpeta de la app y navega a ella
mkdir -p ~/findParking
cd ~/findParking

# Clona el repo de GitHub
git clone https://github.com/seminarioA/findParking.git .

# Construye y levanta los contenedores
sudo docker-compose up --build -d

# Muestra estado de los contenedores
sudo docker ps

echo "Despliegue terminado. Accede por la IP pública de tu EC2."
