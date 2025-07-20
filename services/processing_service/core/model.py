from ultralytics import YOLO
import logging

logger = logging.getLogger("model_loader")

def load_model(path: str):
    try:
        return YOLO(path)
    except Exception as e:
        logger.error(f"Error cargando modelo: {e}")
        raise

def load_classes(file_path: str):
    try:
        with open(file_path, 'r') as f:
            return f.read().strip().split('\n')
    except Exception as e:
        logger.error(f"Error cargando clases: {e}")
        raise