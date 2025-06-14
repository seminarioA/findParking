# camera.py

import cv2
import threading
import time
from utils import load_model, load_classes, dict2np, detect_and_assign, draw_spaces

class VideoProcessor:
    def __init__(self):
        self.model = load_model("yolo11n.pt")
        self.class_list = load_classes("coco.txt")
        self.cap = cv2.VideoCapture("parking1.mp4")

        self.coord_areas = {
            "area1":[(52,364),(30,419),(73,420),(88,365)],
            "area2":[(105,353),(86,428),(137,427),(146,358)],
            "area3":[(159,354),(150,427),(204,425),(203,353)],
            "area4":[(217,352),(219,422),(273,418),(261,347)],
            "area5":[(274,345),(286,417),(338,415),(321,345)],
            "area6":[(336,343),(357,410),(409,408),(382,340)],
            "area7":[(396,338),(426,404),(479,399),(439,334)],
            "area8":[(458,333),(494,397),(543,390),(495,330)],
            "area9":[(511,327),(557,388),(603,383),(549,324)],
            "area10":[(564,323),(615,381),(654,372),(596,315)],
            "area11":[(616,316),(666,369),(703,363),(642,312)],
            "area12":[(674,311),(730,360),(764,355),(707,308)] 
        }
        self.arr_num = dict2np(self.coord_areas)

        self.frame = None
        self.occupancy = {f"area{i}": 0 for i in range(1, 13)}
        self.lock = threading.Lock()

        self.thread = threading.Thread(target=self.update, daemon=True)
        self.thread.start()

    def update(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            frame = cv2.resize(frame, (1020, 500))
            results = self.model.predict(frame)
            occupancy = detect_and_assign(frame, results, self.class_list, self.arr_num)
            draw_spaces(frame, occupancy, self.arr_num)

            with self.lock:
                self.occupancy = occupancy
                _, jpeg = cv2.imencode('.jpg', frame)
                self.frame = jpeg.tobytes()


            time.sleep(0.03)  # ~30 FPS

    def get_frame(self):
        with self.lock:
            return self.frame

    def get_occupancy(self):
        with self.lock:
            return dict(self.occupancy)

# Instancia global usada por app.py
processor = VideoProcessor()
