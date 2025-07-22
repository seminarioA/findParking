from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from starlette.websockets import WebSocketDisconnect
import redis
import httpx
import asyncio
import logging
import os

# --- Configuración de logging estructurado ---
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger("video_service")

# --- Configuración de Redis segura ---
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

# --- Inicialización de FastAPI ---
app = FastAPI(title="Video Service", version="1.0")

# --- Verificación de JWT contra microservicio de auth ---
async def verify_jwt(token: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                "http://auth_service:8003/api/auth/verify",
                json={"token": token},
            )
            if response.status_code == 200:
                return True
            logger.warning(f"JWT inválido: {response.status_code} - {response.text}")
            return False
    except httpx.RequestError as e:
        logger.error(f"Error HTTPX verificando JWT: {str(e)}")
        return False
    except Exception as e:
        logger.exception(f"Excepción inesperada en verify_jwt: {str(e)}")
        return False

# --- WebSocket para video procesado ---
@app.websocket("/api/video/{camera_id}/processed")
async def processed_video_ws(camera_id: str, websocket: WebSocket):
    token = websocket.headers.get("sec-websocket-protocol", "")
    if not token or not await verify_jwt(token):
        await websocket.close(code=4401)
        logger.warning(f"JWT inválido en /api/video/{camera_id}/processed")
        return

    await websocket.accept(subprotocol=token)
    logger.info(f"Conexión WS establecida: /api/video/{camera_id}/processed")

    try:
        while True:
            try:
                frame = redis_client.get(f"frame_{camera_id}_processed")
                if frame:
                    await websocket.send_bytes(frame)
            except redis.ConnectionError as e:
                logger.error(f"Error de conexión Redis: {str(e)}")
                await asyncio.sleep(1)
            except Exception as e:
                logger.error(f"Error enviando frame: {str(e)}")
            await asyncio.sleep(0.03)

    except WebSocketDisconnect:
        logger.info(f"Desconexión WS: /api/video/{camera_id}/processed")
    except asyncio.CancelledError:
        logger.warning(f"Cancelación WS detectada: /api/video/{camera_id}/processed")
        raise
    except Exception as e:
        logger.exception(f"Excepción no controlada en WebSocket: {str(e)}")

# --- WebSocket para video sin procesar ---
@app.websocket("/api/video/{camera_id}/raw")
async def raw_video_ws(camera_id: str, websocket: WebSocket):
    token = websocket.headers.get("sec-websocket-protocol", "")
    if not token or not await verify_jwt(token):
        await websocket.close(code=4401)
        logger.warning(f"JWT inválido en /api/video/{camera_id}/raw")
        return

    await websocket.accept(subprotocol=token)
    logger.info(f"Conexión WS establecida: /api/video/{camera_id}/raw")

    try:
        while True:
            try:
                frame = redis_client.get(f"frame_{camera_id}_raw")
                if frame:
                    await websocket.send_bytes(frame)
            except redis.ConnectionError as e:
                logger.error(f"Error de conexión Redis: {str(e)}")
                await asyncio.sleep(1)
            except Exception as e:
                logger.error(f"Error enviando frame raw: {str(e)}")
            await asyncio.sleep(0.03)

    except WebSocketDisconnect:
        logger.info(f"Desconexión WS: /api/video/{camera_id}/raw")
    except asyncio.CancelledError:
        logger.warning(f"Cancelación WS detectada: /api/video/{camera_id}/raw")
        raise
    except Exception as e:
        logger.exception(f"Excepción no controlada en WebSocket RAW: {str(e)}")
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