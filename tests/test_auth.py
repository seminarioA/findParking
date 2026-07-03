import atexit
import os
import sys
import tempfile
import uuid

AUTH_SERVICE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api", "auth"))
if AUTH_SERVICE_ROOT not in sys.path:
    sys.path.insert(0, AUTH_SERVICE_ROOT)

# app.config reads these via os.getenv() at import time, so they must be set
# before the first `import app.*` below.
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

_db_fd, _db_path = tempfile.mkstemp(suffix=".db", prefix="findparking_test_auth_")
os.close(_db_fd)
os.environ["DB_URL"] = f"sqlite:///{_db_path}"
atexit.register(lambda: os.path.exists(_db_path) and os.remove(_db_path))

from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402

client = TestClient(app)


def _unique_email() -> str:
    return f"user_{uuid.uuid4().hex[:10]}@example.com"


def test_register_and_login_success():
    email = _unique_email()
    password = "S3curePass!"

    register_resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "role": "USUARIO"},
    )
    assert register_resp.status_code == 200

    login_resp = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login_resp.status_code == 200
    body = login_resp.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_register_duplicate_email_fails():
    email = _unique_email()
    client.post(
        "/api/auth/register",
        json={"email": email, "password": "first-password", "role": "USUARIO"},
    )
    dup_resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": "second-password", "role": "USUARIO"},
    )
    assert dup_resp.status_code == 400


def test_login_wrong_password_fails():
    email = _unique_email()
    client.post(
        "/api/auth/register",
        json={"email": email, "password": "correct-password", "role": "USUARIO"},
    )

    login_resp = client.post(
        "/api/auth/login",
        json={"email": email, "password": "wrong-password"},
    )
    assert login_resp.status_code == 401


def test_verify_endpoint_with_valid_token():
    email = _unique_email()
    password = "AnotherPass1!"
    client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "role": "USUARIO"},
    )
    token = client.post(
        "/api/auth/login", json={"email": email, "password": password}
    ).json()["access_token"]

    verify_resp = client.get(
        "/api/auth/verify", headers={"Authorization": f"Bearer {token}"}
    )
    assert verify_resp.status_code == 200
    body = verify_resp.json()
    assert body["sub"] == email
    assert body["role"] == "USUARIO"


def test_verify_endpoint_with_garbage_token_fails():
    verify_resp = client.get(
        "/api/auth/verify", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert verify_resp.status_code == 401
