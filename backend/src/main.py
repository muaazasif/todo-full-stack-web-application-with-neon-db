from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, tasks, user as user_api
from .database.database import engine
from .models import user, task  # Import models to create tables

# Create tables
from sqlmodel import SQLModel
SQLModel.metadata.create_all(engine)

# Create FastAPI app
app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Include routers with proper prefixes
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(user_api.router, prefix="/api", tags=["user"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)