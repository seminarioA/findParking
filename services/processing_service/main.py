"""
Processing Service
Microservicio dedicado al procesamiento de video con YOLO + OpenCV y publicación en Redis.
"""

import cv2
import time
import pickle
import os
import logging
import redis
from ultralytics import YOLO
import numpy as np
import pandas as pd
import json

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("processing_service")

MODEL_PATH = "resources/yolo11n.pt"
CLASSES_PATH = "resources/coco.txt"
VIDEO_PATHS = {
    "entrada1": "resources/parking1.mp4"
    # Puedes agregar más cámaras aquí
}
AREAS_PATH = "resources/areas.json"

def load_model(path):
    return YOLO(path)

def load_classes(file_path):
    with open(file_path, 'r') as f:
        return f.read().strip().split('\n')

def dict2np(dict_coords):
    return {k: np.array(v, np.int32) for k, v in dict_coords.items()}

def mark_car(frame, x1, y1, x2, y2, cx, cy):
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

def detect_and_assign(frame, results, class_list, arr_num):
    occupancy = {area: 0 for area in arr_num.keys()}
    detections = pd.DataFrame(results[0].boxes.data).astype("float")
    for _, row in detections.iterrows():
        x1, y1, x2, y2, _, cls_id = map(int, row[:6])
        cls_name = class_list[cls_id]
        if cls_name == 'car':
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            for area, polygon in arr_num.items():
                if cv2.pointPolygonTest(polygon, (cx, cy), False) >= 0:
                    occupancy[area] = 1
                    mark_car(frame, x1, y1, x2, y2, cx, cy)
                    break
    return occupancy

def draw_spaces(frame, occupancy, arr_num):
    for area, polygon in arr_num.items():
        color = (0, 0, 255) if occupancy[area] else (0, 255, 0)
        cv2.polylines(frame, [polygon], True, color, 2)
        pos = tuple(polygon[0])
        cv2.putText(frame, area, pos, cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

def load_areas():
    with open(AREAS_PATH, 'r') as f:
        return json.load(f)

def process_video():
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    model = load_model(MODEL_PATH)
    class_list = load_classes(CLASSES_PATH)
    areas_config = load_areas()
    for camera_id, video_path in VIDEO_PATHS.items():
        arr_num = dict2np(areas_config[camera_id])
        cap = cv2.VideoCapture(video_path)
        while True:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            frame = cv2.resize(frame, (1020, 500))
            results = model.predict(frame)
            occupancy = detect_and_assign(frame, results, class_list, arr_num)
            draw_spaces(frame, occupancy, arr_num)
            _, jpeg = cv2.imencode('.jpg', frame)
            # Publicar en Redis
            redis_client.set(f"frame_{camera_id}_processed", jpeg.tobytes())
            redis_client.set(f"occupancy_{camera_id}", pickle.dumps(occupancy))
            time.sleep(0.03)

if __name__ == "__main__":
    logger.info("Iniciando microservicio de procesamiento de video...")
    process_video()
