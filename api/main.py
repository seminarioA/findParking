# main.py

from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from api.video import video_stream_generator
from api.occupancy import get_occupancy_data
from api.auth import router as auth_router
from api.views import router as views_router
from api.webrtc import router as webrtc_router
import os


app = FastAPI(title="FindParking API", version="2.0")
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), '../static')), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth_router)
app.include_router(views_router)


@app.get("/occupancy")
def occupancy():
    data = get_occupancy_data()
    return Response(content=data, media_type="application/json")

@app.get("/")
def root():
    return {"message": "FindParking API v2"}
