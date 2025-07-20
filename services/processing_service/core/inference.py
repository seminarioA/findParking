import cv2
import numpy as np
import pandas as pd
from utils.drawing import mark_car

def detect_and_assign(frame, results, class_list, polygons: dict):
    occupancy = {area: 0 for area in polygons}
    detections = pd.DataFrame(results[0].boxes.data).astype("float")

    for _, row in detections.iterrows():
        x1, y1, x2, y2, _, cls_id = map(int, row[:6])
        cls_name = class_list[cls_id]
        if cls_name == 'car':
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            for name, poly in polygons.items():
                if cv2.pointPolygonTest(poly, (cx, cy), False) >= 0:
                    occupancy[name] = 1
                    mark_car(frame, x1, y1, x2, y2, cx, cy)
                    break
    return occupancy