import requests

def test_auth_token_success():
    url = "http://localhost:8003/api/auth/token"
    data = {"username": "admin", "password": "admin123"}
    response = requests.post(url, data=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data
    assert json_data["token_type"] == "bearer"

def test_auth_token_fail():
    url = "http://localhost:8003/api/auth/token"
    data = {"username": "admin", "password": "wrongpass"}
    response = requests.post(url, data=data)
    assert response.status_code == 401 or response.status_code == 200
    json_data = response.json()
    assert "access_token" not in json_data or json_data.get("error")
