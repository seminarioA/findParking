# webrtc.py
from fastapi import APIRouter, WebSocket
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from aiortc.contrib.media import MediaBlackhole
import cv2
import numpy as np
import pickle
import redis
import asyncio

redis_client = redis.Redis(host='localhost', port=6379, db=0)
router = APIRouter()

class RedisVideoStreamTrack(VideoStreamTrack):
    kind = "video"
    async def recv(self):
        pts, time_base = await self.next_timestamp()
        frame = redis_client.get('latest_frame')
        if frame:
            img = np.frombuffer(pickle.loads(frame), dtype=np.uint8)
            img = cv2.imdecode(img, cv2.IMREAD_COLOR)
            # Convert to aiortc VideoFrame
            from av import VideoFrame
            video_frame = VideoFrame.from_ndarray(img, format="bgr24")
            video_frame.pts = pts
            video_frame.time_base = time_base
            return video_frame
        await asyncio.sleep(0.03)
        return None

@router.websocket("/ws/video")
async def video_ws(websocket: WebSocket):
    await websocket.accept()
    pc = RTCPeerConnection()
    video_track = RedisVideoStreamTrack()
    pc.addTrack(video_track)
    try:
        while True:
            data = await websocket.receive_text()
            msg = eval(data)
            if msg["type"] == "offer":
                offer = RTCSessionDescription(sdp=msg["sdp"], type=msg["type"])
                await pc.setRemoteDescription(offer)
                answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                await websocket.send_text(str({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}))
    except Exception as e:
        await websocket.close()
        pc.close()
