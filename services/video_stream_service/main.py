# main.py

from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from config import VIDEO_PATHS
from camera_manager import generate_mjpeg_stream
import os

app = FastAPI()

@app.get("/stream/{camera_id}")
def stream_camera(camera_id: str):
    video_path = VIDEO_PATHS.get(camera_id)
    if not video_path or not os.path.exists(video_path):
        return Response(status_code=404, content="Video no encontrado")

    return StreamingResponse(
        generate_mjpeg_stream(video_path),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )