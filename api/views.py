# views.py
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from api.auth import get_current_user
import os

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), '../templates'))
router = APIRouter()

@router.get("/admin", response_class=HTMLResponse)
def admin_view(request: Request, user=Depends(get_current_user)):
    if user["role"] != "admin":
        return RedirectResponse("/login")
    return templates.TemplateResponse("admin_view.html", {"request": request, "user": user})

@router.get("/user", response_class=HTMLResponse)
def user_view(request: Request, user=Depends(get_current_user)):
    if user["role"] != "user":
        return RedirectResponse("/login")
    return templates.TemplateResponse("user_view.html", {"request": request, "user": user})

@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
