from pydantic import BaseModel


class TaskPriority(BaseModel):
    task_id: int
    titre: str
    score: float
    raison: str


class PrioritizeResponse(BaseModel):
    taches_prioritaires: list[TaskPriority]


class Suggestion(BaseModel):
    heure: str
    tache: str
    raison: str


class SuggestionsResponse(BaseModel):
    planning: list[Suggestion]


class AnalyseResponse(BaseModel):
    insights: list[str]
    taux_completion: float
    categorie_forte: str
    conseil: str
