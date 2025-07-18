# occupancy.py
import redis
import pickle
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_occupancy_data():
    data = redis_client.get('latest_occupancy')
    if data:
        occupancy = pickle.loads(data)
    else:
        occupancy = {f"area{i}": 0 for i in range(1, 13)}
    total = {
        "occupied": sum(1 for v in occupancy.values() if v == 1),
        "free": sum(1 for v in occupancy.values() if v == 0)
    }
    return json.dumps({"areas": occupancy, "summary": total})
