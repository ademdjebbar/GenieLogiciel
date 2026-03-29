```mermaid
sequenceDiagram
    actor User
    participant LoginPage as React Frontend
    participant APIService as Axios Instance
    participant AuthRouter as FastAPI Backend
    participant DB as Database

    User->>+LoginPage: Remplit le formulaire (email, password)
    User->>LoginPage: Clique sur "Se connecter"
    
    LoginPage->>+APIService: login(formData)
    APIService->>+AuthRouter: POST /api/auth/login (email, password)
    
    AuthRouter->>+DB: SELECT * FROM users WHERE email = ...
    DB-->>-AuthRouter: Retourne les données de l'utilisateur (avec mdp hashé)
    
    alt Email ou mot de passe incorrect
        AuthRouter-->>-APIService: Erreur 401 Unauthorized
        APIService-->>-LoginPage: Exception (Promise.reject)
        LoginPage->>User: Affiche une notification d'erreur
    else Mot de passe correct
        AuthRouter-->>AuthRouter: Crée le jeton JWT
        AuthRouter-->>-APIService: Réponse 200 OK avec { access_token: "..." }
        
        APIService-->>-LoginPage: Réponse succès (Promise.resolve)
        
        LoginPage->>LoginPage: Stocke le token dans localStorage
        
        LoginPage->>+APIService: getMe()
        APIService->>+AuthRouter: GET /api/auth/me (avec header 'Authorization: Bearer ...')
        
        AuthRouter->>AuthRouter: Valide le jeton JWT
        AuthRouter->>+DB: SELECT * FROM users WHERE id = ...
        DB-->>-AuthRouter: Retourne les données utilisateur
        
        AuthRouter-->>-APIService: Réponse 200 OK avec les données utilisateur
        APIService-->>-LoginPage: Réponse succès
        
        LoginPage->>LoginPage: Met à jour AuthContext (user, isAuthenticated)
        LoginPage-->>-User: Redirige vers le Dashboard
    end
```

### Description

Ce diagramme de séquence détaille les étapes du processus de connexion :

1.  L'utilisateur soumet ses identifiants.
2.  Le frontend React appelle le service API avec les données.
3.  Le backend FastAPI vérifie les informations en base de données.
4.  Si les informations sont valides, le backend génère un jeton JWT et le renvoie.
5.  Le frontend reçoit le jeton, le stocke, puis effectue un second appel pour récupérer les informations complètes de l'utilisateur (`/me`).
6.  Une fois les données utilisateur reçues, le contexte d'authentification est mis à jour et l'utilisateur est redirigé vers son tableau de bord.
