import redis
import pickle
import os
import logging

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

logger = logging.getLogger("redis_client")
logging.basicConfig(level=logging.INFO)

class RedisManager:
    def __init__(self, host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB):
        self.client = redis.Redis(host=host, port=port, db=db)
    def set_frame(self, key, frame):
        try:
            self.client.set(key, pickle.dumps(frame))
        except Exception as e:
            logger.error(f"Error guardando frame en Redis: {e}")
    def get_frame(self, key):
        try:
            data = self.client.get(key)
            return pickle.loads(data) if data else None
        except Exception as e:
            logger.error(f"Error obteniendo frame de Redis: {e}")
            return None
    def set_occupancy(self, key, occupancy):
        try:
            self.client.set(key, pickle.dumps(occupancy))
        except Exception as e:
            logger.error(f"Error guardando ocupación en Redis: {e}")
    def get_occupancy(self, key):
        try:
            data = self.client.get(key)
            return pickle.loads(data) if data else None
        except Exception as e:
            logger.error(f"Error obteniendo ocupación de Redis: {e}")
            return None
redis_manager = RedisManager()
