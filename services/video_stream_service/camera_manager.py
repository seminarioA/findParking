# camera_manager.py

import cv2
import time
from contextlib import closing
from fastapi import HTTPException
from services.video_stream_service.utils import build_mjpeg_frame

def generate_mjpeg_stream(video_path: str):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail=f"No se pudo abrir el video en {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    delay = 1.0 / fps if fps > 0 else 0.04  # fallback a 25 FPS

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            _, jpeg = cv2.imencode('.jpg', frame)
            yield build_mjpeg_frame(jpeg.tobytes())
            time.sleep(delay)
    finally:
        cap.release()