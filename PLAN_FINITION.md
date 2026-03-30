# Plan de Finition — Priora

## Statut : En cours

---

### 1. IA — Priorisation intelligente avec Gemini
**Fichier** : `backend/src/services/ai.service.ts`
**Statut** : A FAIRE
**Priorité** : Haute

Actuellement, `calculatePriority()` utilise des mots-clés hardcodés et `estimateTime()` compte les mots du titre. Remplacer par de vrais appels à Gemini pour obtenir des scores et estimations pertinents. Conserver les heuristiques comme fallback en cas d'erreur API.

---

### 2. IA — Améliorer le chat contextuel
**Fichier** : `backend/src/controllers/ai.controller.ts`
**Statut** : A FAIRE
**Priorité** : Haute

- Limiter le contexte à 20 tâches max (les plus récentes/urgentes)
- Utiliser `systemInstruction` de Gemini au lieu de coller le prompt dans le message user
- Inclure la date du jour pour les recommandations temporelles

---

### 3. Frontend — Métriques dynamiques
**Fichier** : `frontend/src/pages/StatsPage.tsx`
**Statut** : A FAIRE
**Priorité** : Moyenne

"Temps économisé" (4.2h) et "Vélocité" (+12%) sont hardcodés. Les calculer dynamiquement à partir des tâches DONE et de leur estimatedTime.

---

### 4. Frontend — Loading states
**Fichiers** : `Dashboard.tsx`, `TasksPage.tsx`, `CalendarPage.tsx`, `StatsPage.tsx`
**Statut** : A FAIRE
**Priorité** : Moyenne

Ajouter des spinners/skeletons pendant le chargement des données API.

---

### 5. Backend — Sécurité et logging
**Fichier** : `backend/src/index.ts`
**Statut** : A FAIRE
**Priorité** : Moyenne

- Activer `helmet()` (installé mais pas utilisé)
- Activer `morgan('dev')` (installé mais pas utilisé)
- Ajouter un middleware d'erreur global Express

---

### 6. Frontend — Variable d'environnement API
**Fichiers** : Tous les fichiers avec `fetch("http://localhost:8000/...")`
**Statut** : A FAIRE
**Priorité** : Basse

Extraire dans `VITE_API_URL` pour faciliter le déploiement.
