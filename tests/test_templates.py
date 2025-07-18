from flask import Flask
import pytest

def test_user_view():
    app = Flask(__name__, template_folder='../templates')
    with app.test_client() as client:
        response = client.get('/')
        assert response.status_code == 200
        assert b'<html' in response.data

def test_admin_view():
    app = Flask(__name__, template_folder='../templates')
    with app.test_client() as client:
        response = client.get('/admin')
        assert response.status_code == 200
        assert b'<html' in response.data

def test_login_view():
    app = Flask(__name__, template_folder='../templates')
    with app.test_client() as client:
        response = client.get('/login')
        assert response.status_code == 200
        assert b'<html' in response.data
