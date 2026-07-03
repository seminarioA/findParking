import json
import os
import sys

import jwt as pyjwt

OCCUPANCY_SERVICE_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "api", "occupancy")
)
if OCCUPANCY_SERVICE_ROOT not in sys.path:
    sys.path.insert(0, OCCUPANCY_SERVICE_ROOT)

# main.py reads these via os.getenv() at import time.
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")

from fastapi.testclient import TestClient  # noqa: E402
import main as occupancy_main  # noqa: E402

client = TestClient(occupancy_main.app)


class DummyRedis:
    def __init__(self, data=None):
        self.data = data or {}

    def get(self, key):
        value = self.data.get(key)
        return value.encode() if value is not None else None


def _make_token():
    return pyjwt.encode({"sub": "tester"}, "test-secret", algorithm="HS256")


def test_occupancy_without_token_fails():
    resp = client.get("/api/occupancy/entrada1")
    assert resp.status_code == 401


def test_occupancy_with_invalid_token_fails():
    resp = client.get(
        "/api/occupancy/entrada1",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert resp.status_code == 401


def test_occupancy_success(monkeypatch):
    payload = {"spot_1": 1, "spot_2": 0}
    monkeypatch.setattr(
        occupancy_main,
        "redis_client",
        DummyRedis({"occupancy_entrada1": json.dumps(payload)}),
    )
    token = _make_token()
    resp = client.get(
        "/api/occupancy/entrada1",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["areas"] == payload
    assert body["summary"] == {"occupied": 1, "free": 1}


def test_occupancy_no_data_returns_empty_structure(monkeypatch):
    monkeypatch.setattr(occupancy_main, "redis_client", DummyRedis({}))
    token = _make_token()
    resp = client.get(
        "/api/occupancy/entrada2",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json() == {"areas": {}, "summary": {"occupied": 0, "free": 0}}
