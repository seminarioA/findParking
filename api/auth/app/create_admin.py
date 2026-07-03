from .database import SessionLocal, engine
from .models import Base, User
from .security import hash_password

Base.metadata.create_all(bind=engine)

usuarios = [
    ("U22203099@utp.edu.pe", "U22203099", "admin"),
    ("U22247409@utp.edu.pe", "U22247409", "admin"),
    ("U22209965@utp.edu.pe", "U22209965", "admin"),
    ("U22247454@utp.edu.pe", "U22247454", "admin"),
]


def crear_usuarios(lista_usuarios):
    db = SessionLocal()
    try:
        for email, password, role in lista_usuarios:
            existente = db.query(User).filter_by(email=email).first()
            if existente:
                existente_id = getattr(existente, "id", "desconocido")
                print(f"El usuario con email '{email}' ya existe. (id: {existente_id})")
                continue

            hashed = hash_password(password)

            nuevo = User(email=email, hashed_password=hashed, role=role)
            db.add(nuevo)

            try:
                db.commit()
                print(f"Usuario creado: {email} (rol: {role})")
            except Exception as e_commit:
                db.rollback()
                print(f"Error al crear usuario {email}: {e_commit}")

    except Exception as e:
        print("Error durante el proceso de creación de usuarios:", e)
    finally:
        db.close()


if __name__ == "__main__":
    crear_usuarios(usuarios)
