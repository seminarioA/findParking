# Etapa base: runtime liviano
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia solo el requirements para cachear instalación de paquetes
COPY requirements.txt .

# -------- BUILD CACHING ENTRE BUILDS -------------
# Esta capa se beneficiará de la cache de pip cuando uses `docker buildx` con --mount=type=cache
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip install --prefer-binary --timeout=120 --retries=10 -r requirements.txt

# Instala libGL.so.1 para OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx && rm -rf /var/lib/apt/lists/*    

# Copia el resto del código
COPY . .

CMD ["python","main.py"]