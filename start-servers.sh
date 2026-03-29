#!/bin/bash

# Script pour démarrer les serveurs backend et frontend de Priora

echo "🚀 Démarrage des services Priora..."
echo "------------------------------------"

# --- Backend (FastAPI) ---
echo "🐍 Lancement du serveur backend FastAPI..."
(
  cd backend || exit
  
  # Vérifier et activer l'environnement virtuel
  if [ ! -d ".venv" ]; then
    echo "Création de l'environnement virtuel..."
    python3 -m venv .venv
  fi
  source .venv/bin/activate
  
  # Installer les dépendances si nécessaire
  pip install -r requirements.txt --quiet
  
  # Lancer le serveur en arrière-plan
  echo "Serveur backend disponible sur http://127.0.0.1:8000"
  uvicorn app.main:app --reload > ../backend.log 2>&1 &
  
  # Sauvegarder le PID pour pouvoir l'arrêter plus tard
  echo $! > ../.backend.pid
) &

# --- Frontend (Vite) ---
echo "⚛️  Lancement du serveur de développement frontend..."
(
  cd frontend || exit
  
  # Installer les dépendances si nécessaire
  if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances npm (cela peut prendre un moment)..."
    npm install
  fi
  
  # Lancer le serveur en arrière-plan
  echo "Serveur frontend disponible sur http://localhost:5173"
  npm run dev > ../frontend.log 2>&1 &
  
  # Sauvegarder le PID
  echo $! > ../.frontend.pid
) &

wait

echo "------------------------------------"
echo "✅ Tous les services sont lancés en arrière-plan."
echo "   - Logs du backend : backend.log"
echo "   - Logs du frontend : frontend.log"
echo "Pour tout arrêter, exécutez : ./stop-servers.sh"
