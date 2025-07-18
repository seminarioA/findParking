"""
Occupancy Service
Microservicio para servir estado de ocupación por cámara.
"""
from fastapi import FastAPI, Depends, HTTPException
import redis
from services.auth_service.main import verify_jwt


import logging
import os

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

app = FastAPI(title="Occupancy Service", version="1.0")
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
logger = logging.getLogger("occupancy_service")
logging.basicConfig(level=logging.INFO)

@app.get("/api/occupancy/{camera_id}")
async def get_occupancy(camera_id: str, user=Depends(verify_jwt)):
    """Devuelve estado de ocupación para camera_id"""
    try:
        data = redis_client.get(f"occupancy_{camera_id}")
        if not data:
            logger.warning(f"No hay datos de ocupación para cámara {camera_id}, devolviendo default.")
            data = {f"area{i}": 0 for i in range(1, 13)}
        else:
            import pickle
            try:
                data = pickle.loads(data)
            except Exception as e:
                logger.error(f"Error deserializando ocupación: {e}")
                data = {f"area{i}": 0 for i in range(1, 13)}
        total = {
            "occupied": sum(1 for v in data.values() if v == 1),
            "free": sum(1 for v in data.values() if v == 0)
        }
        return {"areas": data, "summary": total}
    except Exception as e:
        logger.error(f"Error en endpoint /api/occupancy/{camera_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno en el servicio de ocupación")
