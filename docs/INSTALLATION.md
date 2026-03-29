# Guide d'installation — Priora

## Prérequis

- Python 3.11+
- Node.js 18+
- PostgreSQL

## 1. PostgreSQL

```bash
# Installer PostgreSQL
sudo apt install postgresql

# Créer la base de données et l'utilisateur
sudo -u postgres psql -c "CREATE DATABASE taskai;"
sudo -u postgres psql -c "CREATE USER taskai_user WITH PASSWORD 'taskai123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE taskai TO taskai_user;"
```

## 2. Backend

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

Créer le fichier `backend/.env` :

```
DATABASE_URL=postgresql://taskai_user:taskai123@localhost:5432/taskai
SECRET_KEY=une-cle-secrete-random
ANTHROPIC_API_KEY=sk-ant-ta-cle-ici
```

> La clé Anthropic est optionnelle — tout fonctionne sans, sauf les endpoints IA.

Créer les tables et lancer le serveur :

```bash
python -c "from app.core.database import Base, engine; from app.models import *; Base.metadata.create_all(bind=engine)"
uvicorn app.main:app --reload
```

API disponible sur http://localhost:8000/docs (Swagger UI).

## 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Application disponible sur http://localhost:5173.

## Lancer le projet (résumé)

Il faut **deux terminaux** :

**Terminal 1 — Backend :**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
```

## Tester

1. Ouvrir http://localhost:5173
2. Créer un compte via la page d'inscription
3. Se connecter
4. Créer des tâches, changer leur statut
5. Utiliser le panneau IA (nécessite la clé Anthropic)
