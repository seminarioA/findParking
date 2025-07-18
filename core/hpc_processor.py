# HPC processor logic
from core.camera import ...
from core.redis_client import ...
from core.utils import load_model, load_classes, dict2np, detect_and_assign, draw_spaces
from core.worker import ...
import cv2
import concurrent.futures

class HPCVideoProcessor:
    def __init__(self):
        self.model = load_model("resources/yolo11n.pt")
        self.class_list = load_classes("resources/coco.txt")
        self.cap = cv2.VideoCapture("resources/parking1.mp4")
        self.coord_areas = {
            "area1": [(52,364),(30,419),(73,420),(88,365)],
            "area2": [(105,353),(86,428),(137,427),(146,358)],
            "area3": [(159,354),(150,427),(204,425),(203,353)],
            "area4": [(217,352),(219,422),(273,418),(261,347)],
            "area5": [(274,345),(286,417),(338,415),(321,345)],
            "area6": [(336,343),(357,410),(409,408),(382,340)],
            "area7": [(396,338),(426,404),(479,399),(439,334)],
            "area8": [(458,333),(494,397),(543,390),(495,330)],
            "area9": [(511,327),(557,388),(603,383),(549,324)],
            "area10": [(564,323),(615,381),(654,372),(596,315)],
            "area11": [(616,316),(666,369),(703,363),(642,312)],
            "area12": [(674,311),(730,360),(764,355),(707,308)]
        }
        self.arr_num = dict2np(self.coord_areas)
    def process_frame(self, frame):
        frame = cv2.resize(frame, (1020, 500))
        results = self.model.predict(frame)
        occupancy = detect_and_assign(frame, results, self.class_list, self.arr_num)
        draw_spaces(frame, occupancy, self.arr_num)
        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), occupancy
    def get_next_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = self.cap.read()
        return frame if ret else None
    def process_parallel(self, frame):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(self.process_frame, frame)
            return future.result()
processor_hpc = HPCVideoProcessor()
