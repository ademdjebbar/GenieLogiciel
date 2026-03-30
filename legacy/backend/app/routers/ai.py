from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.task import Task, Statut
from app.schemas.ai import PrioritizeResponse, SuggestionsResponse, AnalyseResponse
from app.services.ai_service import prioritize_tasks, suggest_planning, analyze_habits, AIServiceError

router = APIRouter(prefix="/api/ai", tags=["ia"])


@router.get("/prioritize", response_model=PrioritizeResponse)
def prioritize(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(
        Task.user_id == user.id, Task.statut != Statut.TERMINE
    ).all()
    try:
        return prioritize_tasks(tasks, user)
    except AIServiceError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/suggestions", response_model=SuggestionsResponse)
def suggestions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(
        Task.user_id == user.id, Task.statut != Statut.TERMINE
    ).all()
    try:
        return suggest_planning(tasks, user)
    except AIServiceError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/analyze", response_model=AnalyseResponse)
def analyze(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    try:
        return analyze_habits(tasks, user)
    except AIServiceError as e:
        raise HTTPException(status_code=503, detail=str(e))
