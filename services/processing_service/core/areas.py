import json
import numpy as np
import logging

# Silenciar logs de Ultralytics
logging.getLogger("ultralytics").setLevel(logging.WARNING)
logging.getLogger("ultralytics.yolo.engine.model").setLevel(logging.ERROR)

logger = logging.getLogger("areas_loader")

def load_areas(path: str):
    try:
        with open(path, 'r') as f:
            raw = json.load(f)
        return {k: {name: np.array(polygon, np.int32) for name, polygon in areas.items()} for k, areas in raw.items()}
    except Exception as e:
        logger.error(f"Error cargando areas.json: {e}")
        raise