set -e

sudo apt update

sudo apt install -y docker.io docker-compose

sudo apt install -y git

git clone https://github.com/seminarioA/findParking.git

cd findParking/infra

sudo docker-compose -f docker-compose.yml up --build -d

sudo docker ps
