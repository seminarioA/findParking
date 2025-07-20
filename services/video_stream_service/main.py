from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import cv2
import os

app = FastAPI()

VIDEO_PATHS = {
    "entrada1": "resources/parking1.mp4"
    # Agrega más videos aquí
}

def generate_mjpeg(video_path):
    cap = cv2.VideoCapture(video_path)
    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

@app.get("/stream/{camera_id}")
def stream_video(camera_id: str):
    video_path = VIDEO_PATHS.get(camera_id)
    if not video_path or not os.path.exists(video_path):
        return Response(status_code=404, content="Video no encontrado")
    return StreamingResponse(generate_mjpeg(video_path), media_type="multipart/x-mixed-replace; boundary=frame")
