import cv2
import numpy as np
import pandas as pd
from ultralytics import YOLO

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
    occupancy = {f"area{i}": 0 for i in range(1, 13)}
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
    for i in range(1, 13):
        key = f"area{i}"
        color = (0, 0, 255) if occupancy[key] else (0, 255, 0)
        label_color = color if occupancy[key] else (255, 255, 255)
        pos = tuple(arr_num[key][0])
        cv2.polylines(frame, [arr_num[key]], True, color, 2)
        cv2.putText(frame, str(i), pos, cv2.FONT_HERSHEY_COMPLEX, 0.5, label_color, 1)
    free_spaces = sum(1 for val in occupancy.values() if val == 0)
    cv2.putText(frame, str(free_spaces), (23, 30), cv2.FONT_HERSHEY_PLAIN, 3, (255, 255, 255), 2)
