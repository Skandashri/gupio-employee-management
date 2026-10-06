from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.employees import router as employee_router

app = FastAPI(
    title="Gupio Employee Management API",
    description="Backend API for Gupio Employee Management system",
    version="1.0.0"
)

# CORS configuration allowing frontend clients
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router)


@app.get("/")
def root():
    return {"message": "Gupio Employee Management API is running"}