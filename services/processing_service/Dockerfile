FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependencias del sistema necesarias para OpenCV
# (libGL.so.1 y libgthread-2.0.so.0)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

# Copia solo el requirements para cachear instalación de paquetes
COPY requirements.txt .

# Instala dependencias Python sin cachear entre builds
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefer-binary --timeout=120 --retries=10 -r requirements.txt

# Copia los recursos necesarios para producción
COPY resources /app/resources

# Copia el resto del código
COPY . .

CMD ["python", "main.py"]