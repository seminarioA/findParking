"""Provisiona un único admin inicial a partir de variables de entorno.

Antes este script sembraba 4 cuentas admin con la contraseña igual al usuario,
hardcodeadas en el repo y recreadas en cada arranque (credenciales públicas).
Ahora no hay credenciales en el código: solo crea un admin si se definen
INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD (con una contraseña razonable), y
solo si ese usuario no existe todavía. Sin esas variables, es un no-op seguro.
(TICKET-73)
"""

import os

from .database import SessionLocal, engine
from .models import Base, User
from .security import hash_password

Base.metadata.create_all(bind=engine)

MIN_PASSWORD_LEN = 12


def crear_admin_inicial() -> None:
    email = os.getenv("INITIAL_ADMIN_EMAIL")
    password = os.getenv("INITIAL_ADMIN_PASSWORD")

    if not email or not password:
        print(
            "INITIAL_ADMIN_EMAIL/INITIAL_ADMIN_PASSWORD no definidos; "
            "no se crea ningún admin inicial."
        )
        return

    if len(password) < MIN_PASSWORD_LEN:
        print(
            f"INITIAL_ADMIN_PASSWORD demasiado corta (<{MIN_PASSWORD_LEN} caracteres); "
            "abortando la creación del admin inicial."
        )
        return

    db = SessionLocal()
    try:
        if db.query(User).filter_by(email=email).first():
            print(f"El usuario '{email}' ya existe; no se recrea.")
            return
        db.add(User(email=email, hashed_password=hash_password(password), role="admin"))
        db.commit()
        print(f"Admin inicial creado: {email}")
    except Exception as e:
        db.rollback()
        print(f"Error creando el admin inicial: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    crear_admin_inicial()
