import json

import anthropic

from app.core.config import settings
from app.models.task import Task
from app.models.user import User


class AIServiceError(Exception):
    pass


def _build_tasks_context(tasks: list[Task]) -> str:
    return json.dumps(
        [
            {
                "id": t.id,
                "titre": t.titre,
                "description": t.description,
                "categorie": t.categorie.value,
                "priorite": t.priorite.value,
                "statut": t.statut.value,
                "date_echeance": t.date_echeance.isoformat() if t.date_echeance else None,
                "duree_estimee": t.duree_estimee,
            }
            for t in tasks
        ],
        ensure_ascii=False,
    )


def _call_claude(system_prompt: str, user_prompt: str) -> dict:
    if not settings.ANTHROPIC_API_KEY:
        raise AIServiceError("Clé API Anthropic non configurée")

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        raw = message.content[0].text
        # Extraire le JSON si entouré de markdown ```json ... ```
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]
        return json.loads(raw.strip())
    except anthropic.APIError as e:
        raise AIServiceError(f"Erreur API Claude : {e}")
    except (IndexError, AttributeError):
        raise AIServiceError("L'IA a retourné une réponse vide")
    except json.JSONDecodeError:
        raise AIServiceError("L'IA n'a pas retourné un JSON valide")


def prioritize_tasks(tasks: list[Task], user: User) -> dict:
    if not tasks:
        return {"taches_prioritaires": []}

    system = (
        "Tu es un assistant de productivité. Tu analyses les tâches d'un utilisateur "
        "et les re-classes par ordre de priorité en utilisant la matrice d'Eisenhower "
        "(urgent/important). Réponds UNIQUEMENT en JSON valide avec le format : "
        '{"taches_prioritaires": [{"task_id": int, "titre": str, "score": float 0-10, "raison": str}]}'
    )
    context = _build_tasks_context(tasks)
    prompt = f"Voici les tâches de l'utilisateur :\n{context}\nRe-priorise ces tâches."
    return _call_claude(system, prompt)


def suggest_planning(tasks: list[Task], user: User) -> dict:
    if not tasks:
        return {"planning": []}

    system = (
        "Tu es un assistant de planification. Tu crées un planning journalier optimisé "
        "en tenant compte des horaires de travail et de la durée estimée des tâches. "
        "Réponds UNIQUEMENT en JSON valide avec le format : "
        '{"planning": [{"heure": "HH:MM", "tache": str, "raison": str}]}'
    )
    horaires = (
        f"Horaires de travail : {user.horaire_travail_debut} - {user.horaire_travail_fin}"
        if user.horaire_travail_debut
        else ""
    )
    context = _build_tasks_context(tasks)
    prompt = f"{horaires}\nTâches :\n{context}\nPropose un planning optimisé pour aujourd'hui."
    return _call_claude(system, prompt)


def analyze_habits(tasks: list[Task], user: User) -> dict:
    if not tasks:
        return {"insights": [], "taux_completion": 0, "categorie_forte": "aucune", "conseil": "Ajoutez des tâches pour obtenir une analyse."}

    system = (
        "Tu es un analyste de productivité. Tu analyses l'historique des tâches d'un utilisateur "
        "pour détecter des patterns et donner des conseils. "
        "Réponds UNIQUEMENT en JSON valide avec le format : "
        '{"insights": [str], "taux_completion": float, "categorie_forte": str, "conseil": str}'
    )
    context = _build_tasks_context(tasks)
    prompt = f"Analyse les habitudes de cet utilisateur basé sur ses tâches :\n{context}"
    return _call_claude(system, prompt)
