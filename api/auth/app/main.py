from app.auth import router as auth_router
from app.database import Base, engine
from fastapi import FastAPI

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AuthService", docs_url="/docs")

app.include_router(auth_router)
