from datetime import datetime, timezone, date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.task import Task, Statut


def get_overdue_tasks(db: Session, user_id: int) -> list[Task]:
    now = datetime.now(timezone.utc)
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.statut != Statut.TERMINE,
            Task.date_echeance.isnot(None),
            Task.date_echeance < now,
        )
        .order_by(Task.date_echeance.asc())
        .all()
    )


def get_daily_tasks(db: Session, user_id: int) -> list[Task]:
    today = date.today()
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.statut != Statut.TERMINE,
            Task.date_echeance.isnot(None),
            func.date(Task.date_echeance) == today,
        )
        .order_by(Task.date_echeance.asc())
        .all()
    )
