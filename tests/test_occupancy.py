import requests

def get_jwt():
    url = "http://localhost:8003/api/auth/token"
    data = {"username": "admin", "password": "admin123"}
    response = requests.post(url, data=data)
    return response.json().get("access_token")

def test_occupancy_success():
    token = get_jwt()
    url = "http://localhost:8002/api/occupancy/entrada1"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    assert response.status_code == 200
    json_data = response.json()
    assert "areas" in json_data
    assert "summary" in json_data

def test_occupancy_fail():
    url = "http://localhost:8002/api/occupancy/entrada1"
    response = requests.get(url)
    assert response.status_code == 401 or response.status_code == 500
