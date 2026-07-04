import os

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
DB_URL = os.getenv("DB_URL")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
JWT_SECRET = os.getenv("JWT_SECRET")

# Falla al arrancar si el secreto no está configurado o es débil, en vez de
# operar con un valor por defecto/adivinable. Debe ser el mismo secreto en los
# tres servicios (auth/occupancy/video). Generar con: openssl rand -hex 32
# (TICKET-74)
if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET no está configurado o es demasiado corto (<32 caracteres). "
        "Definí un secreto fuerte y único; no se permiten valores por defecto."
    )
