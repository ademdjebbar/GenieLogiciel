from datetime import time

from sqlalchemy import Boolean, ForeignKey, JSON, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Preference(Base):
    __tablename__ = "preferences"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    categories_favorites: Mapped[list | None] = mapped_column(JSON, default=list)
    notifications_actives: Mapped[bool] = mapped_column(Boolean, default=True)
    heure_resume_quotidien: Mapped[time | None] = mapped_column(Time, default=time(8, 0))

    user = relationship("User", back_populates="preference")
