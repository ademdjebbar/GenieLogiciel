# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Priora — Application de gestion de tâches avec priorisation par IA (Groupe Y, Génie Logiciel L3).

## Architecture

- **Backend**: Python/FastAPI (`backend/app/`) — REST API with JWT auth
- **Frontend**: React/Vite (`frontend/src/`) — SPA with axios
- **Database**: PostgreSQL + SQLAlchemy ORM + Alembic migrations
- **AI**: Anthropic Claude API (`backend/app/services/ai_service.py`)

Backend follows layered architecture: `routers/` (endpoints) → `services/` (business logic) → `models/` (SQLAlchemy) with `schemas/` (Pydantic validation).

## Commands

```bash
# Backend
cd backend && uvicorn app.main:app --reload    # dev server (port 8000)
cd backend && pytest                            # tests

# Frontend
cd frontend && npm run dev                      # dev server (port 5173)
cd frontend && npm test                         # tests
```

Swagger UI: http://localhost:8000/docs

## Key patterns

- Auth: JWT tokens via `core/security.py`, dependency injection with `get_current_user`
- All task/AI endpoints require authentication
- AI service sends structured prompts to Claude API and expects JSON responses
- French language for UI labels, enum values, and API error messages
- Enums defined in `models/task.py`: Categorie, Priorite, Statut
