# Prompt pour la Génération du Logo - Maiden Task Manager

## Description pour IA Génératrice d'Images (DALL-E, Midjourney, Stable Diffusion)

**Prompt Complet :**

> Create a modern, minimalist logo for "Maiden Task Manager", a productivity application. The logo should feature a stylized checkmark or task completion symbol integrated with a shield or maiden silhouette. Use a professional color palette combining deep indigo blue (#4F46E5) and vibrant purple gradients. The design should convey productivity, organization, and empowerment. Include clean geometric shapes, smooth curves, and a sense of forward motion. The style should be flat design with subtle depth, suitable for both app icons and web headers. No text in the logo itself - icon only. High contrast, memorable, and scalable from 16x16px to large formats.

---

## Éléments Clés du Logo

### Symbolisme
Le logo doit évoquer plusieurs concepts fondamentaux de l'application :

- **Productivité et Accomplissement** : Représenté par un symbole de validation (checkmark) ou une coche stylisée qui suggère la complétion des tâches.

- **Protection et Fiabilité** : Un bouclier subtil ou une forme protectrice qui inspire confiance dans la gestion des tâches importantes.

- **Élégance et Modernité** : Des lignes épurées et une esthétique contemporaine qui reflètent une application professionnelle et sophistiquée.

### Palette de Couleurs Recommandée

**Couleur Principale :** Indigo profond (#4F46E5 ou équivalent)
Cette teinte évoque le professionnalisme, la concentration et la technologie moderne. Elle est suffisamment distinctive pour se démarquer tout en restant élégante.

**Couleur Secondaire :** Dégradé violet (#8B5CF6 vers #A78BFA)
Le dégradé ajoute de la profondeur et de la modernité, créant un effet visuel dynamique qui suggère le mouvement et la progression.

**Accents :** Touches de blanc ou gris clair pour le contraste et la lisibilité sur différents arrière-plans.

### Style Visuel

**Flat Design avec Profondeur Subtile :** Le logo doit adopter une approche de design plat moderne, avec des ombres portées légères ou des dégradés subtils pour ajouter de la dimension sans surcharger le design.

**Géométrie Épurée :** Privilégier les formes géométriques simples (cercles, triangles, carrés arrondis) qui s'assemblent harmonieusement pour créer une composition équilibrée.

**Scalabilité :** Le design doit rester lisible et reconnaissable à toutes les tailles, du favicon 16x16 pixels aux bannières haute résolution.

### Concepts Alternatifs

Si vous souhaitez explorer différentes directions créatives, voici quelques variations possibles :

1. **Version Minimaliste** : Une simple coche élégante dans un cercle avec un dégradé indigo-violet.

2. **Version Abstraite** : Des formes géométriques qui évoquent une liste de tâches de manière stylisée, avec des éléments qui se superposent pour créer de la profondeur.

3. **Version Symbolique** : Une silhouette féminine abstraite (représentant "Maiden") intégrée avec des éléments de productivité comme des lignes de tâches ou des coches.

---

## Instructions Techniques pour l'IA

**Format de Sortie :** PNG avec fond transparent, résolution minimale 1024x1024 pixels

**Ratio d'Aspect :** Carré (1:1) pour une utilisation optimale comme icône d'application

**Complexité :** Moyenne - suffisamment détaillé pour être intéressant, mais pas trop complexe pour rester lisible en petite taille

**Éviter :** Texte, détails trop fins qui disparaîtraient en petit format, couleurs trop nombreuses (limiter à 2-3 teintes principales)

---

## Exemples de Prompts Alternatifs

### Version Courte (pour Midjourney)
```
minimalist task manager app logo, checkmark shield icon, indigo purple gradient, flat design, geometric shapes, professional, scalable --ar 1:1 --v 6
```

### Version Détaillée (pour DALL-E 3)
```
Design a professional app icon for a task management application called "Maiden Task Manager". The logo should combine a stylized checkmark symbol with elegant geometric shapes. Use a color scheme of deep indigo blue (#4F46E5) transitioning to vibrant purple (#8B5CF6). The design should be modern, minimalist, and convey productivity and organization. Flat design style with subtle depth. No text. Square format, suitable for app icons. Clean, memorable, and scalable.
```

### Version Artistique (pour Stable Diffusion)
```
modern logo design, task completion checkmark, shield emblem, indigo and purple gradient colors, flat vector art, geometric minimalism, professional productivity app icon, clean lines, high contrast, white background, centered composition, 4k resolution
```

---

## Notes d'Utilisation

Une fois le logo généré, vous pourrez l'intégrer dans l'application en :

1. Plaçant le fichier dans le dossier `client/public/` avec un nom descriptif (ex: `maiden-logo.png`)
2. Mettant à jour la constante `APP_LOGO` dans `client/src/const.ts`
3. Créant également un favicon (16x16, 32x32, 64x64 pixels) pour l'onglet du navigateur

Le logo actuel de l'application peut être personnalisé via l'interface de gestion Manus pour synchroniser le favicon avec votre nouveau design.
