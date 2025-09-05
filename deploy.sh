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

# Clona tu repo privado usando token de GitHub (personal access token clásico)
TOKEN_GITHUB="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"
git clone https://$TOKEN_GITHUB@github.com/seminarioA/findParking.git .
# Borra el token de la variable y del historial para mayor seguridad
unset TOKEN_GITHUB
history -d $(history 1 | grep TOKEN_GITHUB | awk '{print $1}') 2>/dev/null || true

# Construye y levanta los contenedores
sudo docker-compose up --build -d

# Muestra estado de los contenedores
sudo docker ps

echo "Despliegue terminado. Accede por la IP pública de tu EC2."
