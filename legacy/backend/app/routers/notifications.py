from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.task import TaskResponse
from app.services.notification_service import get_overdue_tasks, get_daily_tasks

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/overdue", response_model=list[TaskResponse])
def overdue(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_overdue_tasks(db, user.id)


@router.get("/daily-summary", response_model=list[TaskResponse])
def daily_summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_daily_tasks(db, user.id)
