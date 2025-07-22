"""
Occupancy Service
Microservicio para servir estado de ocupación por cámara.
"""

import os
import logging
import redis
import json
import jwt
import asyncio
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.security import HTTPBearer
from jwt import PyJWTError
from dotenv import load_dotenv

# Carga .env
load_dotenv()

# Configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_THIS_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Configuración Redis
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB   = int(os.getenv("REDIS_DB", 0))

# Inicialización Redis
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

# Logger
logger = logging.getLogger("occupancy_service")
logging.basicConfig(level=logging.INFO)

# Seguridad
security = HTTPBearer()

def verify_jwt(token: str = Depends(security)):
    """Verifica el JWT localmente."""
    try:
        return jwt.decode(token.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except PyJWTError as e:
        logger.warning(f"Token inválido: {e}")
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# FastAPI App
app = FastAPI(title="Occupancy Service", version="1.0")

@app.websocket("/api/occupancy/{camera_id}/ws")
async def occupancy_ws(websocket: WebSocket, camera_id: str, token: str = Query(None)):
    # Validar JWT antes de aceptar la conexión
    if not token:
        await websocket.close(code=1008)
        return
    try:
        jwt.decode(token.replace("Bearer ", ""), JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        await websocket.close(code=1008)
        return
    await websocket.accept()
    try:
        while True:
            key = f"occupancy_{camera_id}"
            raw = redis_client.get(key)
            if raw:
                try:
                    data = json.loads(raw.decode())
                    summary = {
                        "occupied": sum(1 for v in data.values() if v == 1),
                        "free":     sum(1 for v in data.values() if v == 0)
                    }
                    await websocket.send_text(json.dumps({"areas": data, "summary": summary}))
                except Exception:
                    pass
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass

@app.get("/api/occupancy/{camera_id}")
async def get_occupancy(camera_id: str, user=Depends(verify_jwt)):
    """Devuelve el estado de ocupación de una cámara."""
    try:
        key = f"occupancy_{camera_id}"
        raw = redis_client.get(key)

        if raw is None:
            logger.info(f"No hay datos para cámara {camera_id}. Retornando estructura vacía.")
            return {"areas": {}, "summary": {"occupied": 0, "free": 0}}

        # Log temporal para depuración
        logger.warning(f"Valor bruto en Redis para {camera_id}: {raw}")
        try:
            data = json.loads(raw.decode())
        except Exception as e:
            logger.error(f"Error deserializando ocupación de {camera_id}: {e}")
            raise HTTPException(status_code=500, detail="Error deserializando datos")

        summary = {
            "occupied": sum(1 for v in data.values() if v == 1),
            "free":     sum(1 for v in data.values() if v == 0)
        }

        return {"areas": data, "summary": summary}

    except Exception as e:
        logger.exception(f"Fallo en /api/occupancy/{camera_id}")
        raise HTTPException(status_code=500, detail="Error interno en servicio de ocupación")