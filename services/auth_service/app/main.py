from fastapi import FastAPI
from app.database import Base, engine
from app.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AuthService", docs_url="/docs")

app.include_router(auth_router)