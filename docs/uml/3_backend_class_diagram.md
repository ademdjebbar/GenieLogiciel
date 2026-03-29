```mermaid
classDiagram
    direction RL
    
    class User {
        +id: int
        +email: str
        +password_hash: str
        +nom: str
        +prenom: str
    }

    class Task {
        +id: int
        +user_id: int
        +titre: str
        +description: str
        +categorie: Categorie
        +priorite: Priorite
        +statut: Statut
    }

    class Preference {
        +id: int
        +user_id: int
        +notifications_actives: bool
    }

    class Categorie {
        <<Enumeration>>
        TRAVAIL
        PERSONNEL
        ETUDES
        AUTRE
    }
    
    class Priorite {
        <<Enumeration>>
        BASSE
        MOYENNE
        HAUTE
        CRITIQUE
    }

    class Statut {
        <<Enumeration>>
        EN_ATTENTE
        EN_COURS
        TERMINE
    }

    User "1" -- "0..*" Task : possède
    User "1" -- "1" Preference : a
    Task o-- Categorie : utilise
    Task o-- Priorite : utilise
    Task o-- Statut : utilise

```

### Description

Ce diagramme de classes illustre les modèles de données principaux du backend et leurs relations :

-   Un `User` peut avoir `plusieurs` `Task` (relation un-à-plusieurs).
-   Chaque `User` a `une` `Preference` associée (relation un-à-un).
-   Chaque `Task` est associée à des énumérations (`Categorie`, `Priorite`, `Statut`) qui définissent des valeurs contraintes.