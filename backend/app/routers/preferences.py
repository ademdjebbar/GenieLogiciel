from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.preference import Preference
from app.schemas.preference import PreferenceResponse, PreferenceUpdate

router = APIRouter(prefix="/api/preferences", tags=["preferences"])


@router.get("/", response_model=PreferenceResponse)
def get_preferences(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    pref = db.query(Preference).filter(Preference.user_id == user.id).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Préférences non trouvées")
    return pref


@router.put("/", response_model=PreferenceResponse)
def update_preferences(
    data: PreferenceUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    pref = db.query(Preference).filter(Preference.user_id == user.id).first()
    if not pref:
        raise HTTPException(status_code=404, detail="Préférences non trouvées")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(pref, key, value)
    db.commit()
    db.refresh(pref)
    return pref
