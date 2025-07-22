import os
import json

def load_config():
    return {
        "redis_host": os.getenv("REDIS_HOST", "redis"),
        "redis_port": int(os.getenv("REDIS_PORT", 6379)),
        "redis_db": int(os.getenv("REDIS_DB", 0)),
        "model_path": os.getenv("MODEL_PATH", "resources/yolo11n.pt"),
        "classes_path": os.getenv("CLASSES_PATH", "resources/coco.txt"),
        "areas_path": os.getenv("AREAS_PATH", "resources/areas.json"),
        "video_sources": json.loads(os.getenv("VIDEO_SOURCES", '{"entrada1": "http://video_stream_service:8010/stream/entrada1"}'))
    }