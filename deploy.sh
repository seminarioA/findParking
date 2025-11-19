set -e

sudo apt update

sudo apt install -y docker.io docker-compose

sudo apt install -y git

git clone https://github.com/seminarioA/findParking.git

cd findParking

sudo docker-compose up --build -d

sudo docker ps
