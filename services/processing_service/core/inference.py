import cv2
import numpy as np
from utils.drawing import mark_car

def detect_and_assign(frame, results, class_list, polygons: dict):
    # Estado de ocupación por área (binario)
    occupancy = {area: 0 for area in polygons}

    # Convertir a NumPy solo si es tensor
    detections = results[0].boxes.data
    if hasattr(detections, 'cpu'):  # torch.Tensor
        detections = detections.cpu().numpy()
    else:
        detections = np.asarray(detections)

    for x1, y1, x2, y2, _, cls_id in detections:
        cls_id = int(cls_id)
        if class_list[cls_id] != 'car':
            continue

        # Centroide
        cx, cy = (int(x1 + x2) // 2, int(y1 + y2) // 2)

        # Evaluar punto dentro de polígonos
        for name, poly in polygons.items():
            if cv2.pointPolygonTest(poly, (cx, cy), False) >= 0:
                occupancy[name] = 1
                mark_car(frame, int(x1), int(y1), int(x2), int(y2), cx, cy)
                break  # Solo marcar primera área que contiene el auto

    return occupancy