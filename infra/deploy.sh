set -e

sudo apt update

sudo apt install -y docker.io docker-compose-plugin git

git clone https://github.com/seminarioA/findParking.git

cd findParking/infra

# Reproducibilidad: las imagenes de los microservicios se construyen una
# sola vez en CI (GitHub Actions) y se publican en GHCR. Este script nunca
# las reconstruye aqui, solo descarga (pull) y corre las mismas imagenes
# que ya pasaron los tests.
#
# Si los packages de GHCR aun son privados, exporta antes de correr este
# script un usuario y un Personal Access Token con scope read:packages:
#   export GHCR_USER=tu-usuario-de-github
#   export GHCR_TOKEN=tu-personal-access-token
if [ -n "${GHCR_TOKEN:-}" ] && [ -n "${GHCR_USER:-}" ]; then
  echo "${GHCR_TOKEN}" | sudo docker login ghcr.io -u "${GHCR_USER}" --password-stdin
fi

sudo docker compose -f docker-compose.yml pull
sudo docker compose -f docker-compose.yml up -d

sudo docker ps
