# Etapa base: runtime liviano
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala libGL.so.1 y libgthread-2.0.so.0 para OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Copia solo el requirements para cachear instalación de paquetes
COPY requirements.txt .

# -------- INSTALL DEPENDENCIES SIN CACHING ENTRE BUILDS -------------
RUN pip install --upgrade pip && \
    pip install --prefer-binary --timeout=120 --retries=10 -r requirements.txt
    
# Copia los recursos necesarios para producción
COPY resources /app/resources

# Copia el resto del código
COPY . .

CMD ["python","main.py"]