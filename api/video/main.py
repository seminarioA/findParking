import os
import jwt
import logging
import redis
import asyncio
from datetime import datetime
from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect

# Logging de producción
logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger("video_service")

# Configuración Redis
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    socket_timeout=2,
    retry_on_timeout=True,
    health_check_interval=30
)

# Configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def verify_jwt_and_get_role(token: str) -> str | None:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if "role" not in payload or "exp" not in payload:
            logger.warning("Payload inválido")
            return None
        if datetime.utcfromtimestamp(payload["exp"]) < datetime.utcnow():
            logger.warning("Token expirado")
            return None
        return payload["role"]
    except jwt.ExpiredSignatureError:
        logger.warning("Firma expirada")
    except jwt.InvalidTokenError as e:
        logger.warning(f"Token inválido: {str(e)}")
    return None

app = FastAPI()

async def handle_video_stream(websocket: WebSocket, camera_id: str, key_suffix: str, allowed_roles: set[str]):
    token = websocket.headers.get("sec-websocket-protocol")
    if not token:
        await websocket.close(code=4401)
        logger.warning("Token no enviado")
        return

    role = verify_jwt_and_get_role(token)
    if role not in allowed_roles:
        await websocket.close(code=4401)
        logger.warning(f"Rol no autorizado: {role}")
        return

    await websocket.accept(subprotocol=token)
    logger.info(f"WS aceptado: {camera_id} ({key_suffix}) - rol={role}")

    try:
        while True:
            frame = redis_client.get(f"frame_{camera_id}_{key_suffix}")
            if frame:
                await websocket.send_bytes(frame)
            await asyncio.sleep(0.03)
    except WebSocketDisconnect:
        logger.info(f"WS desconectado: {camera_id}/{key_suffix}")
    except Exception as e:
        logger.exception(f"Error WS: {str(e)}")

@app.websocket("/api/video/{camera_id}/processed")
async def ws_processed(camera_id: str, websocket: WebSocket):
    await handle_video_stream(websocket, camera_id, "processed", {"admin", "gestor"})

@app.websocket("/api/video/{camera_id}/raw")
async def ws_raw(camera_id: str, websocket: WebSocket):
    await handle_video_stream(websocket, camera_id, "raw", {"admin"})
