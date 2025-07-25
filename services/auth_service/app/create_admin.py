from .database import SessionLocal
from .models import User
from .security import hash_password
from .database import engine
from .models import Base
Base.metadata.create_all(bind=engine)

db = SessionLocal()
email = "alejandroseminariomedina@gmail.com"
password = "alejandro200423"
role = "admin"
hashed_password = hash_password(password)

if not db.query(User).filter_by(email=email).first():
    user = User(email=email, hashed_password=hashed_password, role=role)
    db.add(user)
    db.commit()
    print("Usuario admin creado.")
else:
    print("El usuario admin ya existe.")
db.close()
