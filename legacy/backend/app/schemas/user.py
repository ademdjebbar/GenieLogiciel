from datetime import datetime, time
from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    nom: str
    prenom: str
    horaire_travail_debut: time | None = time(9, 0)
    horaire_travail_fin: time | None = time(18, 0)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError("Le mot de passe doit contenir au moins 6 caractères")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    nom: str
    prenom: str
    horaire_travail_debut: time | None
    horaire_travail_fin: time | None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
