FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Dependencias necesarias para OpenCV (solo runtime, sin paquetes extra)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

# Copiamos primero requirements para aprovechar caching de capas
COPY requirements.txt .

# Instalamos dependencias Python (sin cache pip y sin compilar .pyc para reducir tamaño)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefer-binary --no-compile --timeout=120 --retries=10 -r requirements.txt

# Copiamos solo los directorios necesarios (evita arrastrar __pycache__ si usamos .dockerignore)
COPY resources ./resources
COPY core ./core
COPY config ./config
COPY services ./services
COPY utils ./utils
COPY main.py .

FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Reinstalamos librerías del sistema mínimas (capas pequeñas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

# Creamos usuario no root para mejor seguridad
RUN useradd -r -u 1000 appuser

# Copiamos solo los site-packages ya instalados (torch + ultralytics) desde builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copiamos aplicación
COPY --from=builder /app /app

USER appuser

CMD ["python", "main.py"]