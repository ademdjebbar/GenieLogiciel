# Frontend Priora — Documentation Technique

## Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 19.2.4 | Framework UI |
| Vite | 8.0.1 | Build tool + dev server |
| TypeScript | ~5.8 | Typage statique |
| Tailwind CSS | 4+ | Styling utilitaire |
| Zustand | 5.0.12 | State management |
| React Router | 7.13.2 | Routing SPA |
| Framer Motion | 12.38.0 | Animations |
| Radix UI | - | Composants accessibles (Dialog, Select, Popover...) |
| Lucide React | - | Icônes |
| Recharts | 3.8.1 | Graphiques (Stats) |
| Sonner | 2.0.7 | Notifications toast |
| cmdk | 1.1.1 | Palette de commandes (Cmd+K) |
| date-fns | - | Formatage dates (locale FR) |

## Architecture

```
frontend/src/
├── pages/
│   ├── AuthPage.tsx          # Login / Inscription
│   ├── Dashboard.tsx         # Tableau de bord principal
│   ├── TasksPage.tsx         # Workspace tâches (liste + filtres)
│   ├── CalendarPage.tsx      # Vue calendrier mensuel
│   ├── StatsPage.tsx         # Analytiques + graphiques
│   ├── AIStudio.tsx          # Chat IA
│   └── SettingsPage.tsx      # Profil, catégories, danger zone
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx    # Wrapper avec sidebar
│   │   ├── Sidebar.tsx            # Navigation latérale
│   │   └── CommandPalette.tsx     # Cmd+K
│   ├── dashboard/
│   │   └── AIWidget.tsx           # Widget IA sur le dashboard
│   ├── tasks/
│   │   ├── TaskItem.tsx           # Ligne de tâche
│   │   └── CreateTaskDialog.tsx   # (remplacé par TaskModal)
│   ├── modals/
│   │   ├── TaskModal.tsx          # Créer/éditer tâche
│   │   ├── CategoryModal.tsx      # Créer catégorie
│   │   └── ConfirmDeleteModal.tsx # Confirmation suppression
│   └── ui/                        # Composants shadcn/Radix
│
├── store/
│   └── useModalStore.ts       # État global Zustand (modals, refresh triggers)
│
├── lib/
│   └── utils.ts               # Utilitaire cn() (Tailwind merge)
│
├── App.tsx                    # Routing principal + auth check
├── main.tsx                   # Point d'entrée React
└── index.css                  # Styles globaux + polices
```

## Pages et Fonctionnalités

### AuthPage (`/auth`)
- Toggle Login / Inscription
- Champs : email, mot de passe, nom (inscription)
- Stocke JWT + user dans localStorage
- Bouton Google SSO (désactivé)

### Dashboard (`/`)
- Résumé des tâches (total, à faire, terminées)
- Widget IA : score de productivité + recommandation top tâche
- Graphique d'activité 7 jours
- Top 3 tâches prioritaires IA
- Bouton création rapide

### TasksPage (`/tasks`)
- Liste complète des tâches avec sous-tâches expansibles
- Filtres : statut (TODO/IN_PROGRESS/DONE), catégorie, recherche texte
- Actions : créer, éditer, supprimer, changer statut, toggle sous-tâche
- Timer start/stop (UI seulement, pas persisté)

### CalendarPage (`/calendar`)
- Grille mensuelle avec navigation mois
- Tâches affichées sur leur date d'échéance
- Clic cellule vide → créer tâche à cette date
- Clic tâche → éditer

### AIStudio (`/ai`)
- Interface chat complète (messages user/assistant)
- Actions rapides prédéfinies (Optimisation Hebdo, Audit Urgences, Rapport Focus)
- Sidebar : infos modèle IA, latence, recommandations
- Indicateur de typing animé

### StatsPage (`/stats`)
- Métriques : productivité %, tâches complétées, temps économisé, vélocité
- Graphique tendance 7 jours (Area chart)
- Distribution statuts (Donut chart)
- Export CSV du rapport

### SettingsPage (`/settings`)
- Onglet Profil : modifier nom
- Onglet Catégories : lister, créer, supprimer
- Danger Zone : supprimer le compte

## State Management (Zustand)

```typescript
useModalStore:
  - isTaskModalOpen / openTaskModal() / closeTaskModal()
  - taskToEdit                    // tâche en édition
  - taskRefreshTrigger            // déclenche re-fetch
  - isCategoryModalOpen / openCategoryModal() / closeCategoryModal()
  - categoryRefreshTrigger
  - isConfirmDeleteOpen / openConfirmDelete() / closeConfirmDelete()
  - confirmDeleteAction           // callback de suppression
  - isCommandPaletteOpen / setCommandPaletteOpen()
```

## Intégration API

Toutes les requêtes utilisent `fetch()` natif avec :
- Base URL : `http://localhost:8000`
- Header : `Authorization: Bearer <token>` (depuis localStorage)
- Content-Type : `application/json`

## Design System

- **Thème** : Dark (noir #000/#050505 + accent émeraude #00ffa3 + gris zinc)
- **Polices** : Outfit (headings) + Inter (body)
- **Branding** : "Priora OS Elite Edition" — esthétique tech/hacker
- **Animations** : Framer Motion (entrées, transitions pages, hover)
- **Priorités** : Rouge (critical), Orange (high), Jaune (medium), Gris (low)

## Commandes

```bash
cd frontend
npm install          # Installer les dépendances
npm run dev          # Dev server (port 5173)
npm run build        # Build production
```
