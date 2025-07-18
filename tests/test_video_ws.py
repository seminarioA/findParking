import asyncio
import websockets
import requests
import pytest

def get_jwt():
    url = "http://localhost:8003/api/auth/token"
    data = {"username": "admin", "password": "admin123"}
    response = requests.post(url, data=data)
    return response.json().get("access_token")

@pytest.mark.asyncio
async def test_video_ws():
    token = get_jwt()
    ws_url = "ws://localhost:8001/api/video/entrada1/processed"
    async with websockets.connect(ws_url) as websocket:
        await websocket.send(f'{{"Authorization": "Bearer {token}"}}')
        frame = await websocket.recv()
        assert frame is not None
