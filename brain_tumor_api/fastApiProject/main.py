from fastapi import FastAPI, Depends
from starlette.staticfiles import StaticFiles

from routes import auth, prediction
from models.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Create database tables
Base.metadata.create_all(bind=engine)

# Cấu hình Static Files
app.mount("/static", StaticFiles(directory="D:/University/doantotnghiep/brain_tumor_api/uploads"), name="static")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(prediction.router, prefix="/predictions", tags=["predictions"])