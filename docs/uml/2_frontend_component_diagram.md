```mermaid
graph TD
    direction TB

    subgraph "Point d'Entrée"
        App("App.jsx")
    end

    subgraph "Services Globaux"
        S_API("api.js")
        S_Auth("AuthContext")
    end

    subgraph "Pages"
        P_Login("Login")
        P_Register("Register")
        P_Dashboard("Dashboard")
        P_Tasks("Tasks")
        P_AI("AI")
        P_Settings("Settings")
    end

    subgraph "Composants de Layout"
        C_Layout("Layout")
        C_Sidebar("Sidebar")
        C_Header("Header")
    end

    subgraph "Composants de Fonctionnalités"
        C_TaskCard("TaskCard")
        C_TaskForm("TaskForm")
        C_AIPanel("AIPanel")
        C_AIResult("AIResultCard")
    end
    
    subgraph "Composants UI (atomiques)"
        C_Button("Button")
        C_Input("Input")
        C_Card("Card")
        C_Modal("Modal")
    end

    %% --- Relations ---
    App -- "gère le routing vers" --> P_Login & P_Register & C_Layout
    App -- "fournit" --> S_Auth

    C_Layout -- "contient" --> C_Sidebar & C_Header
    C_Layout -- "affiche" --> P_Dashboard & P_Tasks & P_AI & P_Settings
    
    C_Sidebar -- "utilise" --> S_Auth
    
    P_Login & P_Register -- "utilisent" --> C_Input & C_Button
    
    P_Dashboard -- "utilise" --> C_TaskCard & C_Card
    
    P_Tasks -- "utilise" --> C_TaskCard & C_Modal
    C_Modal -- "contient" --> C_TaskForm
    
    P_AI -- "utilise" --> C_AIPanel & C_AIResult
    
    P_Settings -- "utilise" --> C_Card & C_Input
    
    classDef page fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    class P_Login,P_Register,P_Dashboard,P_Tasks,P_AI,P_Settings page;

    classDef service fill:#fffde7,stroke:#fbc02d,stroke-width:2px;
    class S_API,S_Auth,App service;
```

### Description

Ce diagramme de composants illustre l'architecture du frontend React :

-   **`App.jsx`** est le point d'entrée qui gère le routage et fournit le contexte d'authentification.
-   Les **Pages** (`Dashboard`, `Tasks`, etc.) sont les écrans principaux de l'application.
-   Le **Layout** et ses composants (`Sidebar`, `Header`) structurent l'interface des pages privées.
-   Les **Composants de Fonctionnalités** (`TaskCard`, `AIPanel`) encapsulent une logique métier spécifique.
-   Les **Composants UI** sont des éléments de base réutilisables qui assurent la cohérence visuelle.