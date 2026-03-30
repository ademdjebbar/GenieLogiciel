# Backend Priora — Documentation Technique

## Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js + Express | 5.2.1 | Framework web REST API |
| TypeScript | 6.0.2 | Typage statique |
| Prisma ORM | 7.6.0 | ORM + migrations |
| SQLite | better-sqlite3 12.8.0 | Base de données |
| JWT | jsonwebtoken 9.0.3 | Authentification |
| Google Gemini | @google/genai 1.47.0 | Service IA (chat + priorisation) |
| Zod | 4.3.6 | Validation des entrées |
| Helmet | 8.1.0 | Headers de sécurité |
| Morgan | 1.10.1 | Logging HTTP |
| dotenv | 17.3.1 | Variables d'environnement |

## Architecture

```
backend/
├── prisma/
│   ├── schema.prisma          # Schéma de données
│   └── dev.db                 # Base SQLite
├── src/
│   ├── index.ts               # Point d'entrée Express
│   ├── lib/
│   │   └── db.ts              # Client Prisma singleton
│   ├── middlewares/
│   │   └── auth.middleware.ts  # Vérification JWT
│   ├── controllers/
│   │   ├── auth.controller.ts     # Inscription, login, profil
│   │   ├── task.controller.ts     # CRUD tâches + sous-tâches
│   │   ├── category.controller.ts # CRUD catégories
│   │   └── ai.controller.ts      # Chat IA Gemini
│   ├── services/
│   │   └── ai.service.ts         # Priorisation + estimation IA
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   ├── category.routes.ts
│   │   └── ai.routes.ts
│   └── generated/client/         # Client Prisma auto-généré
├── .env                       # Configuration (secrets)
├── package.json
└── tsconfig.json
```

**Flux** : Routes → Middleware Auth → Controllers → Services → Prisma (DB)

## Schéma de Données (Prisma)

### User
| Champ | Type | Détails |
|-------|------|---------|
| id | UUID | Clé primaire |
| email | String | Unique |
| password | String | Hashé (base64 actuellement) |
| name | String | Nom complet |
| createdAt | DateTime | Auto |

### Task
| Champ | Type | Détails |
|-------|------|---------|
| id | UUID | Clé primaire |
| title | String | Titre de la tâche |
| description | String? | Optionnel |
| status | String | TODO, IN_PROGRESS, DONE |
| priority | String | LOW, MEDIUM, HIGH, CRITICAL |
| isAIPriority | Boolean | Marqué par l'IA |
| aiScore | Int | Score 0-100 |
| aiReasoning | String? | Explication IA |
| estimatedTime | Int? | Minutes estimées |
| dueDate | DateTime? | Date d'échéance |
| categoryId | String? | FK vers Category |
| userId | String | FK vers User |

### SubTask
| Champ | Type | Détails |
|-------|------|---------|
| id | UUID | Clé primaire |
| title | String | Titre |
| completed | Boolean | Statut |
| taskId | String | FK vers Task (cascade delete) |
| userId | String | FK vers User |

### Category
| Champ | Type | Détails |
|-------|------|---------|
| id | UUID | Clé primaire |
| name | String | Nom (unique par user) |
| color | String | Couleur hex (#6366f1) |
| icon | String | Icône (folder) |
| userId | String | FK vers User |

## Endpoints API

### Authentification (`/api/auth`)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /register | Non | Inscription (email, password, name) |
| POST | /login | Non | Connexion → retourne JWT + user |
| GET | /me | Oui | Profil utilisateur courant |
| PATCH | /me | Oui | Modifier le profil (name) |

### Tâches (`/api/tasks`)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | / | Oui | Lister toutes les tâches (+ catégories, sous-tâches) |
| POST | / | Oui | Créer une tâche (+ sous-tâches optionnelles) |
| PATCH | /:id | Oui | Modifier une tâche |
| PATCH | /:id/status | Oui | Changer le statut uniquement |
| DELETE | /:id | Oui | Supprimer une tâche |
| PATCH | /subtasks/:subTaskId | Oui | Toggle complétion sous-tâche |

### Catégories (`/api/categories`)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | / | Oui | Lister les catégories |
| POST | / | Oui | Créer une catégorie |
| DELETE | /:id | Oui | Supprimer une catégorie |

### IA (`/api/ai`)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /chat | Oui | Chat avec Gemini (contexte tâches) |

### Santé
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /health | Non | `{ status: 'OK' }` |

## Système d'Authentification

1. L'utilisateur s'inscrit ou se connecte
2. Le backend génère un JWT (payload : `{ id, email }`, expiration : 7 jours)
3. Le frontend stocke le token dans `localStorage`
4. Chaque requête protégée envoie `Authorization: Bearer <token>`
5. Le middleware `auth.middleware.ts` vérifie le token et attache `req.user`

**Catégories par défaut** créées à l'inscription : Travail, Personnel, Santé

## Service IA

### Chat (`ai.controller.ts`)
- Reçoit l'historique de messages du frontend
- Charge les tâches de l'utilisateur comme contexte
- Envoie tout à Gemini 2.5 Flash avec un prompt système en français
- Retourne la réponse de Gemini

### Priorisation automatique (`ai.service.ts`)
- `calculatePriority(title, description)` → score 0-100 + reasoning
- `estimateTime(title)` → estimation en minutes
- Appelé automatiquement à la création de chaque tâche

## Configuration (.env)

```
DATABASE_URL="file:./prisma/dev.db"
PORT=8000
JWT_SECRET="votre_secret_jwt"
GEMINI_API_KEY="votre_clé_gemini"
```

## Commandes

```bash
cd backend
npm install              # Installer les dépendances
npx prisma generate      # Générer le client Prisma
npx prisma db push       # Appliquer le schéma à la DB
npm run dev              # Serveur dev (nodemon, port 8000)
```
