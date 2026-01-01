FROM python:3.11-slim

# Configuración base
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias de compilación necesarias para paquetes como redis y jwt
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalación de dependencias Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente del microservicio
COPY . .

# Puerto expuesto
EXPOSE 8004

# Comando de ejecución usando Gunicorn + UvicornWorker (producción)
CMD ["gunicorn", "main:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8004", "--workers", "2", "--timeout", "60"]