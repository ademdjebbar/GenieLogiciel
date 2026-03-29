import enum
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Categorie(str, enum.Enum):
    TRAVAIL = "travail"
    PERSONNEL = "personnel"
    ETUDES = "etudes"
    AUTRE = "autre"


class Priorite(str, enum.Enum):
    BASSE = "basse"
    MOYENNE = "moyenne"
    HAUTE = "haute"
    CRITIQUE = "critique"


class Statut(str, enum.Enum):
    EN_ATTENTE = "en_attente"
    EN_COURS = "en_cours"
    TERMINE = "termine"


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    titre: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    categorie: Mapped[Categorie] = mapped_column(Enum(Categorie), default=Categorie.AUTRE)
    priorite: Mapped[Priorite] = mapped_column(Enum(Priorite), default=Priorite.MOYENNE)
    statut: Mapped[Statut] = mapped_column(Enum(Statut), default=Statut.EN_ATTENTE)
    date_echeance: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    date_creation: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    date_completion: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duree_estimee: Mapped[int | None] = mapped_column(Integer)  # en minutes

    user = relationship("User", back_populates="tasks")
