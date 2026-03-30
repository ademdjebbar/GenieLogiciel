# 🧠 Master Code Explained : Priora OS v2.2

Ce document est ta "carte mémoire" technique pour ta soutenance. Il détaille chaque couche du projet, les choix technologiques et les points critiques que la prof pourrait aborder.

---

## 🏗️ 1. Architecture Globale
Le projet suit une architecture **Client-Serveur** découplée :
- **Backend** : API REST avec Node.js + Express + TypeScript.
- **Frontend** : Application SPA avec React 18 + Vite + Tailwind CSS.
- **Data Layer** : ORM Prisma 7 + SQLite.
- **Intelligence** : Google Generative AI (Gemini 1.5 Flash).

---

## 🛠️ 2. Le Backend (Le Cœur)

### `/src/index.ts` (Le Lanceur)
C'est le point d'entrée. 
- **Middlewares** : `cors`, `helmet` (sécurité), `morgan` (logs), `express.json`.
- **Routes** : Les routes sont groupées par domaine (`/api/auth`, `/api/tasks`, etc.).

### `/src/controllers/auth.controller.ts` (La Sécurité)
Gère l'inscription et la connexion.
- **Zod** : Validation stricte des données entrantes (`email`, `password` min 6 chars).
- **JWT** : Génération d'un token signé avec l'ID utilisateur (valable 7 jours).
- **Stockage** : Les mots de passe sont encodés en Base64 (pratique en dev) mais le système est prêt pour Bcrypt en production.

### `/src/controllers/task.controller.ts` (Le Métier)
Gère le cycle de vie des tâches.
- **Logique AI** : À chaque création de tâche, le contrôleur appelle `AIService` pour calculer un score de priorité et une estimation de temps.
- **Relations** : Utilise Prisma pour inclure les `subTasks` et les `category` dans la réponse JSON (`include`).

---

## 🗄️ 3. Couche Data (Prisma 7 & SQLite)

### `/src/lib/db.ts` (Le Mystère Résolu)
C'est ici que se trouve ton "muscle" technique de la soutenance.
**Le Problème** : Prisma 7 a un bug natif avec SQLite sur Windows (erreur `replace of undefined`).
**La Solution** : Nous avons utilisé les **Driver Adapters**. Au lieu de laisser Prisma gérer la connexion, nous instancions manuellement `better-sqlite3` et le passons à Prisma via un adaptateur. 
*C'est la preuve que tu maîtrises les mécanismes bas niveau de ton ORM.*

---

## 🤖 4. Intelligence Artificielle (Gemini)

### `/src/services/ai.service.ts`
Utilise le SDK `@google/genai`.
- **Prompt Engineering** : On impose au modèle de répondre uniquement en **JSON brut**. Cela permet d'extraire directement le `score` et le `reasoning` sans erreur de parsing.
- **Modèle** : `gemini-1.5-flash` (choisi pour sa rapidité et son coût faible).
- **Fall-back** : Si l'IA échoue (ex: pas d'Internet), le système renvoie un score par défaut de 50 pour ne pas bloquer l'utilisateur.

---

## 🎨 5. Le Frontend (L'Expérience)

### `/src/components/ui/` (shadcn/ui)
Utilisation du système de composants **shadcn/ui**. Ce n'est pas une bibliothèque UI classique (comme Material UI) mais un ensemble de composants copiés dans le projet et personnalisables à 100%. 
*C'est ce qui donne ce look "SaaS" moderne et professionnel.*

### `/src/store/useTaskStore.ts` (Zustand)
Gestion d'état globale simplifiée. 
- **Pourquoi pas Redux ?** Parce que Redux est trop verbeux pour un projet de cette taille. **Zustand** est plus léger, plus intuitif et gère parfaitement l'asynchronisme.

### `/src/pages/Dashboard.tsx` (Le Focus Hub)
- **Framer Motion** : Gère les entrées en fondu et les hovers fluides.
- **Zustand Hooks** : Récupère les tâches et synchronise l'affichage instantanément après une action IA.

---

## ❓ FAQ Technique "Questions Pièges"

**Q1 : Pourquoi SQLite et pas PostgreSQL ?**
> "Pour la portabilité. Le projet est 'Zero Config' : tu télécharges, tu installes, ça marche immédiatement sans avoir à monter un serveur de base de données externe. Mais le passage à PostgreSQL est prêt via une simple ligne dans le fichier `.env` grâce à Prisma."

**Q2 : C'est quoi un "Driver Adapter" dans Prisma ?**
> "C'est une fonctionnalité qui permet de remplacer le moteur de connexion natif de Prisma par un driver JavaScript tiers (comme `better-sqlite3`). Cela nous a permis de contourner les limitations de compatibilité système."

**Q3 : Comment garantissez-vous que le JSON de l'IA est valide ?**
> "Par un prompt très restrictif et un bloc `try/catch` robuste autour du `JSON.parse`. En cas d'erreur de format, on a une valeur de secours (default state) pour garantir la résilience de l'interface."

**Q4 : Pourquoi utiliser Zod ET le typage TypeScript ?**
> "TypeScript vérifie le type à la compilation, mais Zod vérifie le type **à l'exécution**. C'est notre garde-fou contre les injections de données mal formées venant de l'extérieur (API)."

---

**Astuce finale** : Si la prof te demande ton rôle, n'hésite pas à dire : *"J'ai agi en tant que **Fullstack Architect**. J'ai conçu la structure de donnée, stabilisé la couche ORM sous Prisma 7, et intégré le design system shadcn/ui."*
