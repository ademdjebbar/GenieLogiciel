```mermaid
graph TD;
    actor User;

    subgraph "Système Priora";
        UC1("Gérer les tâches");
        UC2("S'authentifier");
        UC3("Utiliser l'assistant IA");
        UC4("Gérer ses préférences");
    end;
    
    User --> UC1;
    User --> UC2;
    User --> UC3;
    User --> UC4;

    subgraph "Détails";
        direction LR;
        subgraph "Gestion des tâches";
            UC1_1("Créer");
            UC1_2("Modifier");
            UC1_3("Supprimer");
        end;
        
        subgraph "Assistant IA";
            UC3_1("Prioriser");
            UC3_2("Planifier");
            UC3_3("Analyser");
        end;
    end;

    UC1 -- "inclut" --> UC1_1;
    UC1 -- "inclut" --> UC1_2;
    UC1 -- "inclut" --> UC1_3;

    UC3 -- "inclut" --> UC3_1;
    UC3 -- "inclut" --> UC3_2;
    UC3 -- "inclut" --> UC3_3;
```

### Description

Ce diagramme montre les principales interactions (cas d'utilisation) que l'acteur `User` peut avoir avec le système `Priora`.