"""
Video Service
Microservicio para servir streams de video procesado y original por cámara.
"""
from fastapi import FastAPI, WebSocket, Depends
import redis
from services.auth_service.main import verify_jwt

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

@app.websocket("/api/video/{camera_id}/processed")
async def processed_video_ws(camera_id: str, websocket: WebSocket, user=Depends(verify_jwt)):
    """WebRTC stream procesado para camera_id"""
    await websocket.accept()
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
async def raw_video_ws(camera_id: str, websocket: WebSocket, user=Depends(verify_jwt)):
    """WebRTC stream original para camera_id"""
    await websocket.accept()
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
