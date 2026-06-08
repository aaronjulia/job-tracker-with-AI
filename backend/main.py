from fastapi import FastAPI
from app.routers import users, auth, applications
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI()

origins = [
    origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(applications.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Job Tracker"}
