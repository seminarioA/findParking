# Actualiza el sistema
sudo apt update && sudo apt upgrade -y

# Instala Docker y Docker Compose
sudo apt install -y docker.io docker-compose

# (Opcional) Instala git si vas a clonar tu repo
sudo apt install -y git

# Clona el repo de GitHub
git clone https://github.com/seminarioA/findParking.git

# Construye y levanta los contenedores
sudo docker-compose up --build -d

# Muestra estado de los contenedores
sudo docker ps
