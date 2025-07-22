from fastapi import FastAPI, WebSocket
import redis
import httpx
import httpx
import logging
import os
from starlette.websockets import WebSocketDisconnect

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

app = FastAPI(title="Video Service", version="1.0")
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
logger = logging.getLogger("video_service")
logging.basicConfig(level=logging.INFO)

async def verify_jwt(token: str) -> bool:
    """
    Verifica el JWT llamando al endpoint de autenticación.
    Retorna True si el token es válido, False si no.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://auth_service:8003/api/auth/verify",
                json={"token": token},
                timeout=5.0
            )
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Error verificando JWT: {e}")
        return False

@app.websocket("/api/video/{camera_id}/processed")
async def processed_video_ws(camera_id: str, websocket: WebSocket):
    # Extraer el token JWT del header Sec-WebSocket-Protocol
    token = websocket.headers.get("sec-websocket-protocol", "")
    if not token or not await verify_jwt(token):
        await websocket.close(code=4401)
        logger.warning(f"Conexión rechazada por JWT inválido en /api/video/{camera_id}/processed")
        return
    await websocket.accept(subprotocol=token)
    logger.info(f"WebSocket conectado: /api/video/{camera_id}/processed")
    try:
        import asyncio
        while True:
            frame = redis_client.get(f"frame_{camera_id}_processed")
            if frame:
                try:
                    await websocket.send_bytes(frame)
                except Exception as e:
                    logger.error(f"Error enviando frame: {e}")
            await asyncio.sleep(0.03)
    except WebSocketDisconnect:
        logger.info(f"WebSocket desconectado: /api/video/{camera_id}/processed")
    except Exception as e:
        logger.error(f"Error en WebSocket /api/video/{camera_id}/processed: {e}")

@app.websocket("/api/video/{camera_id}/raw")
async def raw_video_ws(camera_id: str, websocket: WebSocket):
    token = websocket.headers.get("sec-websocket-protocol", "")
    if not token or not await verify_jwt(token):
        await websocket.close(code=4401)
        logger.warning(f"Conexión rechazada por JWT inválido en /api/video/{camera_id}/raw")
        return
    await websocket.accept(subprotocol=token)
    logger.info(f"WebSocket conectado: /api/video/{camera_id}/raw")
    try:
        import asyncio
        while True:
            frame = redis_client.get(f"frame_{camera_id}_raw")
            if frame:
                try:
                    await websocket.send_bytes(frame)
                except Exception as e:
                    logger.error(f"Error enviando frame: {e}")
            await asyncio.sleep(0.03)
    except WebSocketDisconnect:
        logger.info(f"WebSocket desconectado: /api/video/{camera_id}/raw")
    except Exception as e:
        logger.error(f"Error en WebSocket /api/video/{camera_id}/raw: {e}")