import cv2

def mark_car(frame, x1, y1, x2, y2, cx, cy):
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

def draw_spaces(frame, occupancy: dict, polygons: dict):
    for name, poly in polygons.items():
        color = (0, 0, 255) if occupancy[name] else (0, 255, 0)
        cv2.polylines(frame, [poly], True, color, 2)
        pos = tuple(poly[0])
        cv2.putText(frame, name, pos, cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)