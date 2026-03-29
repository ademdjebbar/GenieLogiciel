#!/bin/bash

# Script pour arrêter les serveurs backend et frontend

echo "🛑 Arrêt des services Priora..."
echo "--------------------------"

# Arrêter le serveur backend
if [ -f ".backend.pid" ]; then
    PID=$(cat .backend.pid)
    echo "Arrêt du serveur backend (PID: $PID)..."
    kill "$PID"
    rm .backend.pid
else
    echo "Le serveur backend ne semble pas être en cours d'exécution."
fi

# Arrêter le serveur frontend
if [ -f ".frontend.pid" ]; then
    PID=$(cat .frontend.pid)
    echo "Arrêt du serveur frontend (PID: $PID)..."
    kill "$PID"
    rm .frontend.pid
else
    echo "Le serveur frontend ne semble pas être en cours d'exécution."
fi

# Nettoyer les fichiers de log
rm -f backend.log frontend.log

echo "--------------------------"
echo "✅ Services arrêtés et nettoyage terminé."
