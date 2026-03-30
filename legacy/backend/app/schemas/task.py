from datetime import datetime
from pydantic import BaseModel, field_validator

from app.models.task import Categorie, Priorite, Statut


class TaskCreate(BaseModel):
    titre: str
    description: str | None = None
    categorie: Categorie = Categorie.AUTRE
    priorite: Priorite = Priorite.MOYENNE
    date_echeance: datetime | None = None
    duree_estimee: int | None = None

    @field_validator("titre")
    @classmethod
    def titre_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Le titre ne peut pas être vide")
        return v.strip()

    @field_validator("duree_estimee")
    @classmethod
    def duree_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("La durée estimée doit être positive")
        return v


class TaskUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    categorie: Categorie | None = None
    priorite: Priorite | None = None
    date_echeance: datetime | None = None
    duree_estimee: int | None = None

    @field_validator("titre")
    @classmethod
    def titre_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError("Le titre ne peut pas être vide")
        return v.strip() if v else v

    @field_validator("duree_estimee")
    @classmethod
    def duree_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("La durée estimée doit être positive")
        return v


class TaskStatusUpdate(BaseModel):
    statut: Statut


class TaskResponse(BaseModel):
    id: int
    user_id: int
    titre: str
    description: str | None
    categorie: Categorie
    priorite: Priorite
    statut: Statut
    date_echeance: datetime | None
    date_creation: datetime
    date_completion: datetime | None
    duree_estimee: int | None

    model_config = {"from_attributes": True}
