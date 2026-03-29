# Guide complet pour l'oral — Priora

Tu présentes 1 mois de travail à 4. Tu montres la présentation PDF + les 2 diagrammes UML. Pas de démo, pas de code. C'est une présentation de conception.

---

## SLIDE 1 — Page de titre

Rien de spécial, juste dire :
> "Bonjour, on est le groupe Y, on va vous présenter notre projet Priora, une application de gestion de tâches avec priorisation par intelligence artificielle."

---

## SLIDE 2 — Sommaire

Survoler rapidement les 6 sections. Ne pas s'attarder.

---

## SLIDE 3 — Contexte et Problématique

**Ce que tu dois dire :**
- Le constat : les étudiants galèrent à s'organiser entre les cours, projets, vie perso
- Les applis de to-do classiques (Google Tasks, Todoist...) listent juste les tâches, elles n'aident pas à décider quoi faire en premier
- Notre idée : une app qui utilise l'IA pour **activement** aider l'utilisateur — pas juste lister, mais prioriser, planifier, analyser

**Les 3 points clés à retenir :**
1. Classement automatique par urgence/importance
2. Conseils personnalisés basés sur les habitudes
3. Planning journalier optimisé selon les horaires de l'utilisateur

**Si la prof demande "pourquoi pas juste une to-do list ?"** → Parce qu'une to-do list c'est passif, l'utilisateur doit tout décider lui-même. Nous on veut un assistant actif.

---

## SLIDE 4 — Fonctionnalités principales

4 blocs à expliquer :

### Gestion des utilisateurs
- Inscription avec mot de passe **chiffré** (on stocke jamais le mot de passe en clair)
- Connexion par **token JWT** (j'explique plus bas ce que c'est)
- L'utilisateur peut configurer ses horaires de travail (ex : "je bosse de 9h à 18h")

### Gestion des tâches
- CRUD classique : Créer, Lire, Modifier, Supprimer des tâches
- Chaque tâche a une **catégorie** (travail, études, personnel, autre), une **priorité** (basse à critique), un **statut** (en attente, en cours, terminé)
- On peut filtrer et trier (ex : "montre-moi que les tâches études en cours")

### Intelligence Artificielle
- **Priorisation** : l'IA classe les tâches selon la matrice d'Eisenhower (urgent/important)
- **Planning** : l'IA génère un emploi du temps heure par heure
- **Analyse** : l'IA regarde tes habitudes et te donne des conseils

### Notifications
- Alerte quand des tâches sont en retard
- Résumé quotidien des tâches du jour
- Dashboard avec stats de progression

---

## SLIDE 5 — Technologies choisies

**Si la prof te demande "pourquoi cette techno ?" voilà les réponses :**

| Techno | C'est quoi | Pourquoi on l'a choisie |
|--------|-----------|------------------------|
| **Python / FastAPI** | Framework web Python | Très rapide, syntaxe simple, génère automatiquement la doc de l'API (Swagger). Plus moderne que Flask/Django pour une API REST. |
| **React 18 / Vite** | Librairie JavaScript pour l'interface | Permet de créer des composants réutilisables. Vite = outil de build ultra rapide (remplace Webpack). |
| **PostgreSQL** | Base de données relationnelle | Plus robuste que SQLite, gère bien les relations entre tables, gratuit et open-source. |
| **SQLAlchemy + Alembic** | ORM + outil de migration | SQLAlchemy = on écrit du Python au lieu du SQL brut. Alembic = gère les modifications de structure de la BDD (migrations). |
| **JWT + bcrypt** | Authentification | JWT = token pour rester connecté sans session serveur. bcrypt = algorithme de hachage de mot de passe. |
| **ChatGPT (OpenAI)** | IA | Comprend le langage naturel, peut analyser des données et renvoyer du JSON structuré. |
| **Tailwind CSS** | Framework CSS | Classes utilitaires directement dans le HTML, pas besoin d'écrire du CSS custom. Responsive facilement. |

---

## SLIDE 6 — Architecture générale (schéma)

Le schéma montre 3 blocs + les flèches entre eux :

```
Interface (React)  --requêtes HTTP-->  Serveur (FastAPI)
                                          |            |
                                   lecture/écriture   analyse
                                          |            |
                                    PostgreSQL      ChatGPT
```

**Ce que tu dois expliquer :**
- C'est une architecture **client-serveur**. Le client (React) tourne dans le navigateur de l'utilisateur, le serveur (FastAPI) tourne sur une machine à part.
- Ils communiquent par **requêtes HTTP** (le frontend envoie des requêtes, le backend répond en JSON).
- Le serveur a deux "partenaires" : la base de données PostgreSQL pour stocker les données, et ChatGPT pour les fonctions IA.
- L'utilisateur ne parle JAMAIS directement à ChatGPT ou à la base de données. Tout passe par le serveur.

**Notion importante — API REST :**
- REST = façon standard d'organiser les routes d'une API web
- Chaque ressource a une URL : `/tasks`, `/users`, `/ai/prioritize`
- On utilise les méthodes HTTP : GET (lire), POST (créer), PUT (modifier), DELETE (supprimer)
- Le serveur répond toujours en JSON

**Si on te demande "pourquoi pas appeler ChatGPT directement depuis le frontend ?"** → Pour la sécurité. La clé API serait visible dans le navigateur. En passant par le serveur, la clé reste secrète.

---

## SLIDE 7 — Architecture en couches du backend

3 couches empilées :

1. **Couche Routes (Routers)** — Le point d'entrée. Reçoit les requêtes HTTP, vérifie les paramètres, appelle le bon service, renvoie la réponse. Ex : `POST /tasks` → crée une tâche.

2. **Couche Services** — La logique métier. C'est là que se passent les calculs, les appels à ChatGPT, la logique de notification. Le service ne sait pas d'où vient la requête (web, mobile, test...).

3. **Couche Données (Models)** — Les modèles SQLAlchemy (structure des tables en BDD) et les schémas Pydantic (validation des données entrantes/sortantes).

**Pourquoi séparer en couches ?**
- **Séparation des responsabilités** : chaque couche a un seul job
- **Maintenabilité** : on peut changer l'IA sans toucher aux routes
- **Testabilité** : on peut tester chaque couche indépendamment
- **Travail en parallèle** : un dev peut bosser sur les routes pendant qu'un autre bosse sur les services

**Notion — ORM (Object-Relational Mapping) :**
- Au lieu d'écrire `SELECT * FROM tasks WHERE user_id = 5`, on écrit `Task.query.filter_by(user_id=5)`
- Les tables SQL deviennent des classes Python, les lignes deviennent des objets
- SQLAlchemy est l'ORM le plus utilisé en Python

**Notion — Pydantic :**
- Librairie de validation de données
- On définit un schéma (ex : "le titre doit être un string non vide, la durée doit être positive")
- Si les données ne respectent pas le schéma, erreur 422 automatique
- Ça protège l'API contre les données invalides

---

## SLIDE 8 — Modèle de données

3 entités :

### User (Utilisateur)
- `id` : identifiant unique (clé primaire, auto-incrémenté)
- `email` : unique, sert de login
- `password_hash` : mot de passe hashé (JAMAIS en clair)
- `nom`, `prenom` : identité
- `horaire_travail_debut`, `horaire_travail_fin` : pour que l'IA génère un planning adapté
- `created_at` : date d'inscription

### Task (Tâche)
- `id` : clé primaire
- `user_id` : clé étrangère vers User (à qui appartient la tâche)
- `titre`, `description` : contenu de la tâche
- `categorie` : enum (TRAVAIL, PERSONNEL, ETUDES, AUTRE)
- `priorite` : enum (BASSE, MOYENNE, HAUTE, CRITIQUE)
- `statut` : enum (EN_ATTENTE, EN_COURS, TERMINE)
- `date_echeance` : deadline
- `duree_estimee` : en minutes, pour le planning IA

### Preference
- `user_id` : clé étrangère unique (1 user = 1 preference)
- `categories_favorites` : liste de catégories préférées
- `notifications_actives` : booléen
- `heure_resume_quotidien` : à quelle heure envoyer le résumé

**Relations :**
- User → Task : **1 à plusieurs** (un user a 0 ou N tâches, une tâche appartient à 1 seul user)
- User → Preference : **1 à 1** (un user a exactement 1 enregistrement de préférences)

**Notion — Clé primaire (PK) :** identifiant unique de chaque ligne dans une table. Jamais deux lignes avec le même id.

**Notion — Clé étrangère (FK) :** référence vers une autre table. `task.user_id` pointe vers `user.id`. Ça crée la relation entre les deux tables.

**Notion — Enum :** type avec un nombre fixe de valeurs possibles. La catégorie ne peut être QUE travail, personnel, études ou autre. Ça évite les erreurs (pas de "trvail" ou "Travai").

---

## SLIDE 9 — Diagrammes réalisés

Tu présentes les 2 diagrammes UML ici. C'est le moment de montrer les images PlantUML.

### Diagramme de cas d'utilisation

**C'est quoi un diagramme de cas d'utilisation :**
- Il montre ce que le système fait **du point de vue de l'utilisateur**
- Il ne montre PAS comment c'est codé, juste les interactions possibles
- Il identifie les **acteurs** (qui utilise le système) et les **cas d'utilisation** (quelles actions)

**Notre diagramme :**

**2 acteurs :**
- **Utilisateur** : la personne qui utilise l'app
- **ChatGPT (OpenAI)** : acteur externe, le service IA

**16 cas d'utilisation regroupés en 5 packages :**

| Package | Cas d'utilisation |
|---------|-------------------|
| Authentification | S'inscrire, Se connecter, Consulter son profil, Se déconnecter |
| Gestion des tâches | Créer, Modifier, Supprimer, Changer le statut, Lister avec filtres |
| Intelligence Artificielle | Prioriser (Eisenhower), Générer un planning, Analyser les habitudes |
| Notifications | Voir les tâches en retard, Consulter le résumé quotidien |
| Préférences | Configurer les préférences, Modifier les horaires de travail |

**Les relations entre cas d'utilisation :**
- **`<<include>>`** = inclusion obligatoire. "Pour faire A, il FAUT d'abord faire B."
  - Créer une tâche `<<include>>` Se connecter → tu dois être connecté pour créer une tâche
  - Modifier une tâche `<<include>>` Se connecter → pareil
  - Prioriser `<<include>>` Se connecter → pareil
- **`<<extend>>`** = extension optionnelle. "A PEUT déclencher B en plus."
  - Changer le statut `<<extend>>` Lister les tâches → depuis la liste, tu peux optionnellement changer un statut
  - Modifier les horaires `<<extend>>` Configurer les préférences → les horaires font partie des préférences

**Les 3 cas IA pointent vers ChatGPT** car c'est l'acteur externe qui traite la demande.

**Si la prof demande la différence include/extend :**
- Include = obligatoire, toujours exécuté. "Je ne peux PAS créer une tâche sans être connecté."
- Extend = optionnel, parfois exécuté. "Je PEUX changer le statut depuis la liste, mais je ne suis pas obligé."

### Diagramme de classes

**C'est quoi un diagramme de classes :**
- Il montre la **structure statique** du système : les classes, leurs attributs, leurs méthodes, et les relations entre elles
- C'est la base pour coder les modèles de données

**Notre diagramme contient :**

**3 classes entités** (les données qu'on stocke) :
- `User` — attributs marqués `-` (privé), méthodes marquées `+` (public)
- `Task` — avec ses 3 enums associées
- `Preference` — relation 1-1 avec User

**3 classes de service** (marquées `<<service>>`, la logique métier) :
- `AIService` — 3 méthodes publiques (prioritize, suggest_planning, analyze_habits) + 2 méthodes privées (_build_tasks_context, _call_chatgpt)
- `AuthService` — hash_password, verify_password, create_access_token, get_current_user
- `NotificationService` — get_overdue_tasks, get_daily_tasks

**3 énumérations** (marquées `<<enumeration>>`) :
- `Categorie`, `Priorite`, `Statut`

**Les types de relations :**
- **Ligne pleine** = association. `User "1" -- "0..*" Task` = un user possède 0 à plusieurs tâches
- **Ligne pointillée avec flèche** = dépendance. `AIService ..> Task` = AIService utilise/dépend de Task
- Les **multiplicités** sur les lignes : `"1"` = exactement un, `"0..*"` = zéro ou plusieurs

**Notion — Visibilité :**
- `+` = public (accessible de l'extérieur)
- `-` = privé (accessible uniquement dans la classe)
- Dans notre diagramme : les attributs sont privés, les méthodes de service sont publiques. Les méthodes internes comme `_call_chatgpt` sont privées.

---

## SLIDE 10 — Le rôle de l'IA

**Le fonctionnement général :**
1. L'utilisateur clique sur un bouton IA dans l'interface
2. Le frontend envoie une requête au backend
3. Le backend récupère les tâches de l'utilisateur en BDD
4. Le backend construit un **prompt structuré** (texte avec instructions + données des tâches)
5. Le backend envoie ce prompt à ChatGPT
6. ChatGPT analyse et renvoie une réponse en **JSON**
7. Le backend transmet le JSON au frontend
8. Le frontend affiche le résultat

**Les 3 fonctions :**

### 1. Priorisation (matrice d'Eisenhower)
- La matrice d'Eisenhower classe les tâches sur 2 axes : **urgent** (deadline proche) et **important** (impact fort)
- 4 quadrants : Urgent+Important (faire tout de suite), Important+Pas urgent (planifier), Urgent+Pas important (déléguer), Ni l'un ni l'autre (éliminer)
- L'IA attribue un **score de 0 à 10** à chaque tâche + une justification textuelle

### 2. Planning journalier
- L'IA connaît les horaires de travail de l'utilisateur (ex : 9h-18h)
- Elle connaît la durée estimée de chaque tâche
- Elle génère un emploi du temps heure par heure en plaçant les tâches prioritaires en premier

### 3. Analyse des habitudes
- L'IA regarde les tâches terminées vs en retard
- Elle calcule le taux de complétion
- Elle identifie la catégorie la plus productive
- Elle formule des conseils (ex : "vous terminez plus de tâches le matin, planifiez les tâches importantes avant midi")

**Notion — Prompt :** un prompt c'est le texte qu'on envoie à l'IA. On structure le prompt pour que l'IA comprenne exactement ce qu'on attend (format JSON, quels champs, etc.).

**Notion — JSON :** format de données texte universel. Ex : `{"titre": "Réviser GL", "score": 8.5}`. C'est ce que le frontend et le backend s'échangent.

---

## SLIDE 11 — Exemple d'utilisation

C'est un scénario concret. Raconte-le comme une histoire :

> "Imaginons un étudiant qui a 5 tâches. 2 sont en retard, 1 a une deadline demain. Il sait pas par quoi commencer. Il clique sur 'Prioriser mes tâches'. Le serveur récupère ses 5 tâches, les envoie à ChatGPT. ChatGPT analyse : la deadline de demain c'est le plus urgent, score 9.2. Les 2 tâches en retard, score 8.5. Les autres, scores plus bas. L'étudiant voit directement dans l'interface par quoi commencer, avec la raison pour chaque score."

---

## SLIDE 12 — Les membres du groupe

| Nom | Rôle | Ce qu'il fait |
|-----|------|---------------|
| **Adem DJEBBAR** | Backend Auth | Modèles de données (User, Task, Preference), base de données PostgreSQL, système de sécurité JWT |
| **Nabil MOUSSAOUI** | Backend Métier | CRUD des tâches, intégration avec ChatGPT, services métier |
| **Amir HADROUG** | Frontend | Pages React (login, dashboard, tâches, IA), composants, design Tailwind |
| **Samy KHELLAF** | Intégration | Connexion frontend/backend (appels API, gestion des tokens), documentation |

Préciser : "même si chacun avait un rôle principal, tout le monde participait aux décisions. On se voyait mardi et jeudi midi à la BU, et on communiquait par Snap, WhatsApp et Git."

---

## SLIDE 13 — Planning

- **Semaine 1** (conception) : cahier des charges, choix des technos, diagrammes UML, mise en place du Git
- **Semaine 2** (fondations) : base de données, modèles, authentification, projet React
- **Semaine 3** (fonctionnalités) : CRUD tâches, intégration ChatGPT, design Tailwind
- **Semaine 4** (finitions) : notifications, préférences, tests, documentation, présentation

**Rappel : tu présentes ça comme un planning prévu, pas comme du travail terminé.**

---

## SLIDE 14 — Défis anticipés

4 défis identifiés :
1. **Intégration IA** : ChatGPT renvoie du texte libre, il faut s'assurer qu'il renvoie du JSON exploitable
2. **CORS** : quand le frontend (port 5173) et le backend (port 8000) sont sur des ports différents, le navigateur bloque les requêtes par sécurité. Il faut configurer les en-têtes CORS côté serveur.
3. **Sécurité** : bien implémenter le hachage des mots de passe et la gestion des tokens
4. **Coordination** : définir les contrats d'interface (quel format de requête/réponse) pour que le front et le back puissent avancer en parallèle

**Notion — CORS (Cross-Origin Resource Sharing) :**
- Le navigateur interdit par défaut qu'une page sur `localhost:5173` fasse des requêtes vers `localhost:8000` (domaines/ports différents = "origines" différentes)
- Le serveur doit envoyer des en-têtes HTTP spéciaux pour autoriser ces requêtes
- C'est une protection de sécurité du navigateur

---

## SLIDE 15 — Bilan et prochaines étapes

**Ce qui est fait :**
- Cahier des charges
- Choix des technos et de l'architecture
- Diagrammes UML
- Organisation de l'équipe
- Dépôt Git en place

**Ce qui reste :**
- Développer le backend (auth, CRUD, IA)
- Développer le frontend (pages, composants)
- Intégrer ChatGPT
- Tester et préparer la soutenance finale

---

## SLIDE 16 — Merci / Questions

Juste dire merci et ouvrir aux questions.

---

## QUESTIONS POSSIBLES DE LA PROF

### "Pourquoi FastAPI et pas Django/Flask ?"
→ FastAPI est plus moderne, plus rapide (asynchrone), et génère automatiquement la documentation Swagger de l'API. Django est trop lourd pour une API REST pure. Flask est possible mais FastAPI a la validation des données intégrée avec Pydantic.

### "C'est quoi JWT ?"
→ JSON Web Token. C'est un token (chaîne de caractères) que le serveur donne au client après connexion. Le client le renvoie à chaque requête dans le header `Authorization`. Le serveur vérifie le token pour identifier l'utilisateur. Avantage : **stateless**, le serveur n'a pas besoin de stocker de session.

### "C'est quoi bcrypt ?"
→ Algorithme de hachage de mot de passe. Le hachage c'est une fonction à sens unique : on peut transformer "monMotDePasse" en "a$2b$12x..." mais on ne peut PAS retrouver le mot de passe à partir du hash. bcrypt ajoute un "sel" (valeur aléatoire) pour que deux utilisateurs avec le même mot de passe aient des hash différents.

### "C'est quoi la matrice d'Eisenhower ?"
→ Méthode de priorisation inventée par le président Eisenhower. On classe chaque tâche sur 2 axes : est-ce urgent ? est-ce important ? Ça donne 4 quadrants :
- Urgent + Important → faire immédiatement
- Important + Pas urgent → planifier
- Urgent + Pas important → déléguer si possible
- Ni urgent ni important → éliminer

### "Pourquoi PostgreSQL et pas MySQL ou SQLite ?"
→ SQLite c'est bien pour du dev local mais pas pour de la prod (pas de connexions concurrentes). MySQL marche aussi, mais PostgreSQL est plus standard, plus robuste, et mieux intégré avec SQLAlchemy.

### "C'est quoi un ORM ?"
→ Object-Relational Mapping. Au lieu d'écrire du SQL brut, on manipule des objets Python. La classe `User` correspond à la table `users`, un objet `User(nom="Adem")` correspond à une ligne. L'ORM traduit automatiquement en SQL.

### "C'est quoi Alembic ?"
→ Outil de migration de base de données. Quand on modifie un modèle (ex : ajouter un champ), Alembic génère un script de migration qui modifie la structure de la BDD sans perdre les données existantes.

### "Comment vous gérez la sécurité ?"
→ Trois niveaux : mots de passe hashés avec bcrypt (jamais stockés en clair), tokens JWT pour l'authentification (expirent après un certain temps), et validation des données avec Pydantic (on n'accepte pas n'importe quoi en entrée).

### "C'est quoi une API REST ?"
→ REST = Representational State Transfer. C'est une convention pour organiser les URLs d'une API web. Chaque ressource a une URL (`/tasks`, `/users`), et on utilise les méthodes HTTP (GET, POST, PUT, DELETE) pour les manipuler. Le serveur est **stateless** : il ne garde pas de mémoire entre les requêtes, tout passe par le token.

### "Pourquoi React et pas Vue ou Angular ?"
→ React est la librairie la plus utilisée, le plus gros écosystème de composants, et on la connaissait déjà. Vue serait un bon choix aussi. Angular est plus complexe et surdimensionné pour ce projet.

### "C'est quoi Tailwind CSS ?"
→ Framework CSS utilitaire. Au lieu d'écrire des fichiers CSS avec des classes comme `.bouton-bleu { background: blue; padding: 10px; }`, on met directement les classes dans le HTML : `class="bg-blue-500 p-2"`. C'est plus rapide à écrire et ça évite les conflits de noms CSS.

### "Comment l'IA communique avec votre serveur ?"
→ Le serveur envoie une requête HTTP POST à l'API de ChatGPT avec un prompt structuré. ChatGPT traite la demande et renvoie une réponse texte. Notre serveur extrait le JSON de cette réponse et le transmet au frontend. La clé API est stockée côté serveur uniquement, jamais exposée au client.

### "Vous avez utilisé quel outil pour les diagrammes ?"
→ PlantUML. C'est un langage textuel pour générer des diagrammes UML. On écrit le diagramme en texte (comme du code), et l'outil génère l'image. L'avantage c'est que c'est versionnable avec Git.
