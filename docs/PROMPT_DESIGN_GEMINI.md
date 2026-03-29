# Prompt & Plan de Refonte : "Rose Quartz & Minimalisme Lumineux"

*Prompt conçu pour piloter une refonte Frontend complète depuis la perspective d'un Senior UI/UX Designer.*

**Objectif** : Transformer l'interface avec une esthétique "Light Mode", aérienne, extrêmement épurée et accueillante, dominée par une palette claire et des accents de rose (Rose Poudré, Blush, Magenta doux). L'esthétique doit respirer la sérénité, la clarté et le minimalisme haut de gamme (façon Apple Health, Notion, ou Airbnb).

---

## 1. Direction Artistique & Moodboard

- **Vibe globale** : Calme, organique, chaleureux, premium.
- **Lumière & Espace** : Utilisation radicale du "Negative Space" (espaces blancs généreux) pour laisser "respirer" la donnée et réduire la charge cognitive.
- **Formes** : Bords très arrondis (Squircle effect, `rounded-2xl` ou `rounded-3xl`), silhouettes douces. Strictement aucun angle droit net.
- **Ombrages** : Ombres portées très diffuses, étendues et légèrement colorées pour créer un effet de lévitation (ex: `shadow-[0_20px_40px_-15px_rgba(255,182,193,0.3)]`).

## 2. Design Tokens (Système de Couleurs)

- **Background Principal** : Blanc pur (`#FFFFFF`) ou un blanc cassé à peine réchauffé (`#FEFAFC`).
- **Background Secondaire (Panneaux/Cartes)** : Blanc absolu (`#FFFFFF`) flottant sur le fond, ou Rose très pâle (`#FFF0F5`) pour démarquer subtilement des sections.
- **Primary Accent** : Rose Framboise / Blush (`#FF4D85` ou `#F56A79`). Vif, élégant, attire le regard sans agresser.
- **Secondary Accent** : Rose poudré pastel (`#FFB6C1` ou `#FFE4E1`) pour les tags, badges et états de survol (hover).
- **Texte Principal** : Gris Anthracite très profond (`#1C1C1E` ou `#2D3748`). *Règle UX : Ne jamais utiliser de noir absolu (`#000`) sur fond clair pour adoucir le contraste et reposer les yeux.*
- **Texte Secondaire** : Gris neutre rosé (`#71717A` ou `#888890`).

## 3. Typographie

- **Police** : Inter, Plus Jakarta Sans, ou SF Pro.
- **Hiérarchie** : 
  - **Titres (H1/H2)** : Graisse importante (ExtraBold), interlettrage réduit (`tracking-tight`). Couleur sombre.
  - **Corps de texte** : Medium ou Regular, hauteur de ligne généreuse (`leading-relaxed`).

## 4. Composants & UI Patterns

### Boutons
- **Primary** : Fond rose vibrant, texte blanc en font-bold, ombre rose radiante. Effet d'enfoncement (scale down) très souple au clic.
- **Secondary** : Fond transparent, bordure très fine en rose pâle, texte rose. Se remplit légèrement au survol.
- **Ghost** : Sans fond, devient subtilement gris-rose (`bg-rose-50`) au survol.

### Cartes (Cards)
- Moins de bordures, plus d'ombres. Les cartes se détachent du fond blanc via une Soft Shadow très élégante. Aucune ligne de démarcation dure.
- **Hover States** : La carte s'élève de quelques pixels (`-translate-y-1`) avec une ombre qui s'amplifie logiquement.

### Navigation (Sidebar / Header)
- **Header** : Effet *Glassmorphism* très léger. Un fond blanc translucide (`bg-white/80`, `backdrop-blur-xl`) qui laisse deviner le contenu défilant en dessous.
- **Sidebar** : Flottante ou très légèrement teintée (`#FDFBFD`), avec un indicateur actif (Active State) sous forme de pilule rose.

### Micro-interactions (Framer Motion)
- Transitions fluides et organiques ("bouncy"). Ex: `spring` avec `stiffness: 300, damping: 25`.
- Les listes (Grid/Cards) apparaissent en cascade ("stagger") depuis le bas (`slide-up` avec fondu) lors du montage de la page.

---

## 5. Roadmap d'Implémentation Technique

1. **Configuration Tailwind (`tailwind.config.js`)** : 
   - Désactiver le mode sombre (ou inverser les thèmes).
   - Injecter la nouvelle palette "Rose/Blush" et les ombres douces.
2. **Css Global (`index.css`)** : 
   - Nettoyer les utilitaires actuels. Appliquer le `color-scheme: light` et le fond `#FEFAFC` au `<body/>`.
3. **Core UI Components** : 
   - Refondre `<Button/>`, `<Card/>`, `<Badge/>`, et `<Input/>` avec les nouvelles classes Tailwind.
4. **Layout & Navigation** : 
   - Éclaircir la `<Sidebar/>` et le `<Header/>`, implémenter le "Glassmorphism light".
5. **Vues Principales (`Dashboard.jsx`, `Tasks.jsx`)** : 
   - Supprimer le code "Dark mode", aérer considérablement les grids (`gap-8`), et harmoniser les états vides ("Empty States") de manière accueillante et illustrée.

---
*Prêt pour l'intégration ? Copiez-collez ce prompt ou donnez le "Go" pour commencer la transformation.*
