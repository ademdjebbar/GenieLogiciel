from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, tasks, ai, notifications, preferences

app = FastAPI(title="Priora", version="1.0.0", description="Gestion de tâches avec IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(ai.router)
app.include_router(notifications.router)
app.include_router(preferences.router)


@app.get("/")
def root():
    return {"message": "Priora API", "docs": "/docs"}
