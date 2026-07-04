import os
import sys
from datetime import datetime, timedelta

import jwt as pyjwt
import pytest
from starlette.websockets import WebSocketDisconnect

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

os.environ.setdefault("JWT_SECRET", "test-secret-must-be-at-least-32-bytes-long")

from fastapi.testclient import TestClient  # noqa: E402

from api.video import main as video_main  # noqa: E402


class DummyRedis:
    """Mimics the subset of redis.asyncio used by main.py's producer loop."""

    def __init__(self):
        self.counter = 0

    async def get(self, key: str):
        self.counter += 1
        return f"frame-{self.counter}".encode()


def _make_token(role: str, expires_in=timedelta(minutes=5)):
    payload = {"role": role, "exp": datetime.utcnow() + expires_in}
    return pyjwt.encode(payload, os.environ["JWT_SECRET"], algorithm="HS256")


@pytest.fixture(autouse=True)
def _clean_video_state(monkeypatch):
    # main.py's SPMC state (stream_consumers/producer_tasks) is module-level
    # and shared across tests, so give every test a fresh DummyRedis and make
    # sure no leftover producer tasks linger between tests.
    monkeypatch.setattr(video_main, "redis_client", DummyRedis())
    yield
    video_main.stream_consumers.clear()
    video_main.producer_tasks.clear()


def test_video_ws_processed_stream_with_allowed_role():
    client = TestClient(video_main.app)
    token = _make_token("admin")

    with client.websocket_connect(
        "/api/video/entrada1/processed", subprotocols=[token]
    ) as websocket:
        frame = websocket.receive_bytes()
        assert frame is not None


def test_video_ws_raw_stream_rejects_disallowed_role():
    client = TestClient(video_main.app)
    # /raw only allows "admin"; "gestor" is valid for /processed but not /raw.
    token = _make_token("gestor")

    with (
        pytest.raises(WebSocketDisconnect),
        client.websocket_connect("/api/video/entrada1/raw", subprotocols=[token]) as websocket,
    ):
        websocket.receive_bytes()


def test_video_ws_rejects_missing_token():
    client = TestClient(video_main.app)

    with (
        pytest.raises(WebSocketDisconnect),
        client.websocket_connect("/api/video/entrada1/processed") as websocket,
    ):
        websocket.receive_bytes()


def test_video_ws_rejects_expired_token():
    client = TestClient(video_main.app)
    token = _make_token("admin", expires_in=timedelta(minutes=-5))

    with (
        pytest.raises(WebSocketDisconnect),
        client.websocket_connect(
            "/api/video/entrada1/processed", subprotocols=[token]
        ) as websocket,
    ):
        websocket.receive_bytes()
