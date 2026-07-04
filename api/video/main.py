import asyncio
import logging
import os
from contextlib import suppress
from datetime import datetime

import jwt
import redis.asyncio as redis
from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect

# Logging de producción
logging.basicConfig(format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO)
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
    health_check_interval=30,
)

# Configuración JWT
# Falla al arrancar si el secreto no está configurado o es débil, en vez de
# caer a un valor por defecto público que permitiría forjar tokens. Debe ser el
# mismo secreto que auth/occupancy. Generar con: openssl rand -hex 32 (TICKET-74)
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET no está configurado o es demasiado corto (<32 caracteres); "
        "no se permiten valores por defecto."
    )
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

POLL_INTERVAL = float(os.getenv("VIDEO_POLL_INTERVAL", "0.03"))
stream_consumers: dict[str, set[asyncio.Queue[bytes]]] = {}
producer_tasks: dict[str, asyncio.Task] = {}
state_lock = asyncio.Lock()


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


def _stream_key(camera_id: str, key_suffix: str) -> str:
    return f"{camera_id}:{key_suffix}"


async def _producer_loop(stream_key: str, redis_key: str) -> None:
    try:
        while True:
            async with state_lock:
                targets = stream_consumers.get(stream_key)
                if not targets:
                    producer_tasks.pop(stream_key, None)
                    break
                target_snapshot = tuple(targets)

            try:
                frame = await redis_client.get(redis_key)
                if frame:
                    for queue in target_snapshot:
                        try:
                            queue.put_nowait(frame)
                        except asyncio.QueueFull:
                            logger.debug("Dropping stale frame for %s", stream_key)
                            with suppress(asyncio.QueueEmpty):
                                queue.get_nowait()
                            queue.put_nowait(frame)
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("Error reading frame from Redis for %s", redis_key)

            await asyncio.sleep(POLL_INTERVAL)
    except asyncio.CancelledError:
        logger.info("Producer cancelled for %s", stream_key)
        raise
    finally:
        async with state_lock:
            producer_tasks.pop(stream_key, None)


async def _register_consumer(camera_id: str, key_suffix: str) -> tuple[str, asyncio.Queue[bytes]]:
    stream_key = _stream_key(camera_id, key_suffix)
    queue: asyncio.Queue[bytes] = asyncio.Queue(maxsize=1)
    async with state_lock:
        consumers = stream_consumers.setdefault(stream_key, set())
        consumers.add(queue)
        if stream_key not in producer_tasks:
            producer_tasks[stream_key] = asyncio.create_task(
                _producer_loop(stream_key, f"frame_{camera_id}_{key_suffix}")
            )
    return stream_key, queue


async def _unregister_consumer(stream_key: str, queue: asyncio.Queue[bytes]) -> None:
    async with state_lock:
        consumers = stream_consumers.get(stream_key)
        if consumers is None:
            return

        consumers.discard(queue)
        if not consumers:
            stream_consumers.pop(stream_key, None)


async def handle_video_stream(
    websocket: WebSocket, camera_id: str, key_suffix: str, allowed_roles: set[str]
):
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
    logger.info(f"WS accepted: {camera_id} ({key_suffix}) - rol={role}")

    stream_key, queue = await _register_consumer(camera_id, key_suffix)
    try:
        while True:
            frame = await queue.get()
            if frame:
                await websocket.send_bytes(frame)
    except WebSocketDisconnect:
        logger.info(f"WS desconectado: {camera_id}/{key_suffix}")
    except Exception as e:
        logger.exception(f"Error WS: {str(e)}")
    finally:
        await _unregister_consumer(stream_key, queue)


@app.websocket("/api/video/{camera_id}/processed")
async def ws_processed(camera_id: str, websocket: WebSocket):
    await handle_video_stream(websocket, camera_id, "processed", {"admin", "gestor"})


@app.websocket("/api/video/{camera_id}/raw")
async def ws_raw(camera_id: str, websocket: WebSocket):
    await handle_video_stream(websocket, camera_id, "raw", {"admin"})
