import torch
import logging

logger = logging.getLogger("device_checker")

def get_device():
    try:
        if torch.cuda.is_available():
            logger.info(f"GPU detectada: {torch.cuda.get_device_name(0)}")
            return 'cuda'
        else:
            logger.info("No se detectó GPU. Usando CPU.")
            return 'cpu'
    except Exception:
        logger.warning("Torch no disponible o error. Usando CPU.")
        return 'cpu'