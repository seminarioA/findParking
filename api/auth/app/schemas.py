from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    # NOTA: el rol NO se acepta desde el registro. Un atacante anónimo podría
    # auto-asignarse "admin"/"superadmin". El rol se fuerza a "USUARIO" en el
    # servidor y solo un superadmin puede cambiarlo vía /set-role. (TICKET-71)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
