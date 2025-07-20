import time
import cv2
import pickle
import redis
import logging
from core.inference import detect_and_assign
from utils.drawing import draw_spaces

logger = logging.getLogger("video_processor")

def process_video(camera_id, stream_url, model, class_list, polygons, device):
    redis_client = redis.Redis(host="redis", port=6379, db=0)
    cap = cv2.VideoCapture(stream_url)
    frame_count = 0
    start_time = time.time()

    while True:
        frame_start = time.time()
        ret, frame = cap.read()
        if not ret:
            logger.warning(f"[{camera_id}] Reintentando stream...")
            time.sleep(1)
            continue

        frame = cv2.resize(frame, (1020, 500))
        results = model.predict(frame, device=device)
        occupancy = detect_and_assign(frame, results, class_list, polygons)
        draw_spaces(frame, occupancy, polygons)

        _, jpeg = cv2.imencode('.jpg', frame)
        redis_client.set(f"frame_{camera_id}_processed", jpeg.tobytes())
        redis_client.set(f"occupancy_{camera_id}", pickle.dumps(occupancy))

        frame_count += 1
        elapsed = time.time() - start_time
        if frame_count % 100 == 0:
            fps = frame_count / elapsed
            logger.info(f"[{camera_id}] Frames: {frame_count}, FPS: {fps:.2f}")
