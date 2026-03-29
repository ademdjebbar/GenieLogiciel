# Priora — Gestion de Tâches avec IA

Application intelligente de gestion de tâches avec priorisation par IA.

**Groupe Y** — Projet Génie Logiciel, L3 Informatique.

## Stack Technique

- **Backend** : Python / FastAPI
- **Frontend** : React / Vite
- **Base de données** : PostgreSQL + SQLAlchemy
- **IA** : API Claude (Anthropic)
- **Auth** : JWT

## Lancer le projet

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # configurer les variables
uvicorn app.main:app --reload
```
API disponible sur http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Application disponible sur http://localhost:5173

## Structure
```
backend/    → API FastAPI
frontend/   → Application React
docs/       → Documentation UML et rapport
```
