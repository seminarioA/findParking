# Dockerfile para processing_service
FROM python:3.11-slim
WORKDIR /app
COPY ../../.. /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "services/processing_service/main.py"]
