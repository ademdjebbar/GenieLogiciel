from datetime import time
from pydantic import BaseModel


class PreferenceResponse(BaseModel):
    id: int
    user_id: int
    categories_favorites: list | None
    notifications_actives: bool
    heure_resume_quotidien: time | None

    model_config = {"from_attributes": True}


class PreferenceUpdate(BaseModel):
    categories_favorites: list | None = None
    notifications_actives: bool | None = None
    heure_resume_quotidien: time | None = None
