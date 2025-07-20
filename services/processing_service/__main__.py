# processing_service/__main__.py
"""
Processing Service
Microservicio dedicado al procesamiento de video con YOLO + OpenCV y publicación en Redis.
"""

import logging
import threading
from config.loader import load_config
from core.model import load_model, load_classes
from core.areas import load_areas
from services.video_processor import process_video
from utils.device import get_device

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("processing_service")

if __name__ == "__main__":
    logger.info("Iniciando microservicio de procesamiento de video...")
    try:
        config = load_config()
        model = load_model(config["model_path"])
        class_list = load_classes(config["classes_path"])
        areas_config = load_areas(config["areas_path"])
        device = get_device()

        threads = []
        for camera_id, stream_url in config["video_sources"].items():
            if camera_id not in areas_config:
                logger.warning(f"[{camera_id}] no tiene áreas definidas. Ignorando.")
                continue
            t = threading.Thread(
                target=process_video,
                args=(camera_id, stream_url, model, class_list, areas_config[camera_id], device),
                daemon=True
            )
            t.start()
            threads.append(t)

        for t in threads:
            t.join()
    except Exception as e:
        logger.error(f"Error general en el microservicio: {e}")