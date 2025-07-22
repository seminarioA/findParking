FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias mínimas necesarias para instalar paquetes con C bindings (ej. redis, httpx)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8004

# Gunicorn con UvicornWorker para concurrencia y robustez
CMD ["gunicorn", "main:app", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8004", "--workers", "2", "--timeout", "60"]