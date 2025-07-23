# from .database import SessionLocal
# from .models import User
# from .security import hash_password

# db = SessionLocal()
# email = "alejandroseminariomedina@gmail.com"
# password = "alejandro200423"
# role = "admin"
# hashed_password = hash_password(password)

# if not db.query(User).filter_by(email=email).first():
#     user = User(email=email, hashed_password=hashed_password, role=role)
#     db.add(user)
#     db.commit()
#     print("Superadmin creado.")
# else:
#     print("El superadmin ya existe.")
# db.close()
