# video.py
import redis
import pickle
import time

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def video_stream_generator():
    while True:
        frame = redis_client.get('latest_frame')
        if frame:
            frame = pickle.loads(frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(0.03)
