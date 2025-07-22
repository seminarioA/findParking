from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from .schemas import UserCreate, UserLogin, TokenResponse
from .models import User
from .security import (
    get_db, hash_password, verify_password,
    create_access_token, verify_token
)
from .blacklist import revoke_token
import uuid

router = APIRouter(prefix="/api/auth")

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")
    new_user = User(email=user.email, hashed_password=hash_password(user.password), role=user.role)
    db.add(new_user)
    db.commit()
    return {"msg": "Usuario registrado"}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    jti = str(uuid.uuid4())
    token = create_access_token({"sub": user.email, "role": user.role, "jti": jti})
    return {"access_token": token}

@router.post("/logout")
def logout(Authorization: str = Header(...), db: Session = Depends(get_db)):
    token = Authorization.split(" ")[1]
    payload = verify_token(token, db)
    revoke_token(payload["jti"], db)
    return {"msg": "Token revocado"}


# Nuevo endpoint para obtener el usuario actual (email y rol)
@router.get("/me")
def get_me(Authorization: str = Header(...), db: Session = Depends(get_db)):
    token = Authorization.split(" ")[1]
    payload = verify_token(token, db)
    return {"email": payload["sub"], "role": payload["role"]}

@router.get("/verify")
def verify(Authorization: str = Header(...), db: Session = Depends(get_db)):
    token = Authorization.split(" ")[1]
    payload = verify_token(token, db)
    return {"sub": payload["sub"], "role": payload["role"]}