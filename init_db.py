"""
init_db.py
--- Script de inicialización de usuarios y base de datos ---
Uso: Ejecutar solo para poblar credenciales y datos iniciales.
ADVERTENCIA: No usar en producción sin asegurar el almacenamiento seguro de contraseñas.
Revisa y adapta la lógica según el backend real (DB, Redis, etc).
"""

from api.db import Base, engine, SessionLocal
from api.crud import create_user
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#[Archivo migrado a scripts/init_db.py]
Base.metadata.create_all(bind=engine)

# Crear usuario admin
username = "alejandro"
password = "alejandro200423"
role = "admin"
hashed_password = pwd_context.hash(password)

db = SessionLocal()
if not db.query(User).filter(User.username == username).first():
    create_user(db, username, hashed_password, role)
    print(f"Usuario admin '{username}' creado.")
else:
    print(f"El usuario '{username}' ya existe.")
db.close()
