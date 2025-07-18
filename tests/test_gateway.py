import requests

def test_gateway_auth():
    url = "http://localhost/api/auth/token"
    data = {"username": "admin", "password": "admin123"}
    response = requests.post(url, data=data, verify=False)
    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data

def test_gateway_occupancy():
    # Primero obtenemos el token
    url_auth = "http://localhost/api/auth/token"
    data = {"username": "admin", "password": "admin123"}
    response_auth = requests.post(url_auth, data=data, verify=False)
    token = response_auth.json().get("access_token")
    url = "http://localhost/api/occupancy/entrada1"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, verify=False)
    assert response.status_code == 200
    json_data = response.json()
    assert "areas" in json_data
    assert "summary" in json_data
