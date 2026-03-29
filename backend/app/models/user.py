from datetime import datetime, timezone, time

from sqlalchemy import String, DateTime, Time, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    nom: Mapped[str] = mapped_column(String(100))
    prenom: Mapped[str] = mapped_column(String(100))
    horaire_travail_debut: Mapped[time | None] = mapped_column(Time, default=time(9, 0))
    horaire_travail_fin: Mapped[time | None] = mapped_column(Time, default=time(18, 0))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    preference = relationship("Preference", back_populates="user", uselist=False, cascade="all, delete-orphan")
