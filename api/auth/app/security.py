from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import JWT_SECRET, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import TokenBlacklist

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "jti": data.get("jti")})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def verify_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        jti = payload.get("jti")
        if db.query(TokenBlacklist).filter_by(jti=jti).first():
            raise HTTPException(status_code=401, detail="Token revocado")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")