# Documentation Complète - Maiden Task Manager

**Application de Gestion de Tâches avec Gamification et Analytics**

---

## Vue d'Ensemble

Maiden Task Manager est une application web moderne de gestion de tâches conçue pour maximiser la productivité personnelle. L'application combine des fonctionnalités CRUD complètes avec un système de priorités visuelles, des animations CSS attractives, et un tableau de bord analytique qui calcule automatiquement les scores de productivité quotidiens, hebdomadaires et mensuels.

### Fonctionnalités Principales

L'application offre une expérience complète de gestion de tâches avec les capacités suivantes. Les utilisateurs peuvent créer des tâches avec un titre, une description optionnelle, une date d'échéance et un niveau de priorité (Haute, Moyenne, Basse). Le système de priorités utilise un code couleur intuitif : rouge pour les tâches urgentes, jaune pour les tâches moyennes et bleu pour les tâches de faible priorité.

Les tâches de haute priorité non complétées bénéficient d'une animation CSS de pulsation rouge qui attire l'attention de l'utilisateur sur les éléments urgents nécessitant une action immédiate. Cette animation subtile mais efficace garantit que les tâches critiques ne passent jamais inaperçues.

Le marquage des tâches comme complétées transforme visuellement la tâche avec un texte barré, une opacité réduite et une icône de validation verte, offrant une satisfaction visuelle immédiate lors de l'accomplissement d'une tâche. Les utilisateurs peuvent également éditer ou supprimer des tâches à tout moment, avec des confirmations appropriées pour éviter les suppressions accidentelles.

Le tableau de bord analytique constitue le cœur de la gamification. Il affiche en temps réel le nombre total de tâches, les tâches complétées, les tâches urgentes actives et calcule automatiquement un score de productivité en pourcentage. Ce score est calculé selon la formule simple mais efficace : (Tâches Complétées / Tâches Totales) × 100.

Les statistiques sont segmentées en trois périodes temporelles distinctes. Le score quotidien analyse toutes les tâches créées et complétées le jour même. Le score hebdomadaire couvre la semaine en cours du lundi au dimanche. Le score mensuel englobe toutes les tâches du mois calendaire actuel. Chaque période affiche le nombre total de tâches, le nombre de tâches complétées et le score de productivité correspondant.

Le système de badges récompense les accomplissements exceptionnels. Le badge "Perfectionniste" est décerné lorsque l'utilisateur atteint un score de 100% sur une journée avec au moins une tâche complétée, célébrant l'excellence dans l'exécution des tâches planifiées.

---

## Architecture Technique

### Stack Technologique

L'application repose sur une architecture moderne et éprouvée combinant plusieurs technologies de pointe.

**Frontend :** React 19 avec TypeScript offre une base solide pour construire une interface utilisateur réactive et type-safe. Tailwind CSS 4 permet un développement rapide avec des utilitaires CSS modernes et un système de design cohérent. Le routage est géré par Wouter, une alternative légère à React Router. Les composants UI proviennent de shadcn/ui, une bibliothèque de composants accessibles et personnalisables construits sur Radix UI.

**Backend :** Express 4 fournit le serveur HTTP robuste et éprouvé. tRPC 11 établit une communication type-safe entre le frontend et le backend sans nécessiter de génération de code ou de contrats manuels. L'authentification est gérée par Manus OAuth, un système d'authentification intégré qui simplifie considérablement la gestion des utilisateurs.

**Base de Données :** MySQL/TiDB stocke toutes les données de manière relationnelle et performante. Drizzle ORM offre une couche d'abstraction type-safe pour interagir avec la base de données, avec des migrations automatiques et une excellente expérience développeur.

**Outils de Développement :** Vite assure un développement rapide avec hot module replacement. Vitest fournit un framework de test moderne et performant. TypeScript garantit la sécurité des types à travers toute l'application.

### Structure de la Base de Données

La base de données est organisée en trois tables principales qui capturent toutes les informations nécessaires au fonctionnement de l'application.

**Table `users`** : Cette table stocke les informations des utilisateurs authentifiés. Chaque utilisateur possède un identifiant unique auto-incrémenté, un openId provenant de Manus OAuth qui garantit l'unicité de l'utilisateur, un nom et un email optionnels, une méthode de connexion, un rôle (user ou admin), ainsi que des timestamps de création, mise à jour et dernière connexion.

**Table `tasks`** : Le cœur de l'application, cette table contient toutes les tâches créées par les utilisateurs. Chaque tâche est liée à un utilisateur via userId, possède un titre obligatoire, une description optionnelle, une date d'échéance optionnelle, une priorité (high, medium, low) avec medium comme valeur par défaut, un statut de complétion (0 pour non complété, 1 pour complété), une date de complétion qui est renseignée uniquement lorsque la tâche est marquée comme faite, et des timestamps de création et mise à jour automatiques.

**Table `analytics`** : Cette table stocke les statistiques agrégées pour optimiser les performances du tableau de bord. Chaque entrée est liée à un utilisateur, spécifie une période (daily, weekly, monthly), utilise une clé de période formatée (YYYY-MM-DD pour daily, YYYY-Www pour weekly, YYYY-MM pour monthly), enregistre le nombre total de tâches et de tâches complétées, calcule le score de productivité en pourcentage (0-100), et maintient des timestamps de création et mise à jour.

---

## Arborescence Complète des Fichiers

L'organisation du projet suit une structure claire et modulaire qui facilite la maintenance et l'évolution de l'application.

### Racine du Projet

```
maiden-task-manager/
├── client/                          # Application frontend React
├── server/                          # Application backend Express + tRPC
├── drizzle/                         # Schémas et migrations de base de données
├── shared/                          # Types et constantes partagés
├── storage/                         # Helpers pour le stockage S3
├── package.json                     # Dépendances et scripts npm
├── tsconfig.json                    # Configuration TypeScript
├── vite.config.ts                   # Configuration Vite
├── drizzle.config.ts                # Configuration Drizzle ORM
├── todo.md                          # Suivi des fonctionnalités
├── LOGO_PROMPT.md                   # Guide pour créer le logo
└── DOCUMENTATION.md                 # Ce fichier
```

### Structure Frontend (client/)

```
client/
├── public/                          # Fichiers statiques
│   └── (logo, favicon, etc.)
├── src/
│   ├── _core/                       # Fonctionnalités core du framework
│   │   └── hooks/
│   │       └── useAuth.ts           # Hook d'authentification
│   ├── components/
│   │   ├── ui/                      # Composants shadcn/ui de base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ...
│   │   ├── tasks/                   # Composants de gestion des tâches
│   │   │   ├── PriorityBadge.tsx    # Badge de priorité coloré
│   │   │   ├── TaskCard.tsx         # Carte de tâche individuelle
│   │   │   ├── TaskForm.tsx         # Formulaire création/édition
│   │   │   └── TaskList.tsx         # Liste avec filtres
│   │   ├── dashboard/               # Composants du dashboard
│   │   │   ├── StatsCard.tsx        # Carte de statistique
│   │   │   └── ProductivityScore.tsx # Affichage du score
│   │   ├── ErrorBoundary.tsx        # Gestion des erreurs React
│   │   └── ...
│   ├── contexts/
│   │   └── ThemeContext.tsx         # Contexte pour le thème clair/sombre
│   ├── pages/
│   │   ├── Dashboard.tsx            # Page principale de l'application
│   │   └── NotFound.tsx             # Page 404
│   ├── lib/
│   │   └── trpc.ts                  # Configuration client tRPC
│   ├── const.ts                     # Constantes de l'application
│   ├── App.tsx                      # Routeur et configuration globale
│   ├── main.tsx                     # Point d'entrée React
│   └── index.css                    # Styles globaux + Tailwind
└── index.html                       # Template HTML
```

### Structure Backend (server/)

```
server/
├── _core/                           # Infrastructure du framework
│   ├── context.ts                   # Contexte tRPC avec authentification
│   ├── trpc.ts                      # Configuration tRPC
│   ├── cookies.ts                   # Gestion des cookies de session
│   ├── env.ts                       # Variables d'environnement
│   ├── systemRouter.ts              # Routes système
│   └── index.ts                     # Serveur Express principal
├── db.ts                            # Fonctions d'accès à la base de données
├── routers.ts                       # Définition des routes tRPC
├── auth.logout.test.ts              # Tests pour l'authentification
└── tasks.test.ts                    # Tests pour les tâches et analytics
```

### Structure Base de Données (drizzle/)

```
drizzle/
├── schema.ts                        # Définition des tables (users, tasks, analytics)
├── 0000_initial.sql                 # Migration initiale
└── 0001_yummy_squadron_supreme.sql  # Migration des tables tasks et analytics
```

---

## Guide d'Utilisation

### Pour les Utilisateurs Finaux

L'utilisation de Maiden Task Manager est intuitive et ne nécessite aucune formation particulière.

**Connexion :** Lors de votre première visite, vous serez redirigé vers la page de connexion Manus OAuth. Connectez-vous avec vos identifiants Manus ou créez un compte si vous n'en avez pas. Une fois authentifié, vous serez automatiquement redirigé vers le tableau de bord.

**Création de Tâches :** Cliquez sur le bouton bleu "Nouvelle tâche" en haut à droite de l'onglet Tâches. Remplissez le formulaire avec un titre obligatoire, une description optionnelle pour plus de détails, une date d'échéance si nécessaire, et sélectionnez le niveau de priorité approprié. Cliquez sur "Créer" pour ajouter la tâche à votre liste.

**Gestion des Tâches :** Chaque tâche affiche son titre, sa description, sa date d'échéance et un badge de priorité coloré. Les tâches de haute priorité non complétées pulsent avec une animation rouge pour attirer votre attention. Utilisez le bouton "Marquer comme fait" pour compléter une tâche, le bouton avec l'icône crayon pour éditer les détails, ou le bouton rouge avec l'icône poubelle pour supprimer définitivement la tâche après confirmation.

**Filtrage des Tâches :** Trois onglets vous permettent de filtrer votre vue. L'onglet "Toutes" affiche l'ensemble de vos tâches avec leur statut actuel. L'onglet "Actives" montre uniquement les tâches non complétées nécessitant votre attention. L'onglet "Terminées" liste vos accomplissements avec un style visuel atténué.

**Consultation des Statistiques :** Basculez vers l'onglet "Statistiques" pour accéder au tableau de bord analytique. Quatre cartes de statistiques résument vos performances : total des tâches créées, nombre de tâches complétées avec le nombre restant, tâches de haute priorité actives nécessitant une attention urgente, et score global de complétion en pourcentage.

**Scores de Productivité :** Trois grandes cartes affichent vos scores pour différentes périodes. Le score quotidien reflète votre performance du jour avec un message d'encouragement adapté. Le score hebdomadaire couvre la semaine en cours du lundi au dimanche. Le score mensuel englobe tout le mois calendaire actuel. Chaque carte montre le pourcentage de réussite, le nombre de tâches complétées, le nombre de tâches restantes et le total des tâches.

**Badges et Récompenses :** Lorsque vous atteignez un score de 100% sur une journée, un badge "Perfectionniste" apparaît avec un message de félicitations. Ce système de gamification encourage l'excellence et célèbre vos accomplissements.

### Pour les Développeurs

Le développement et la maintenance de l'application suivent des pratiques modernes et efficaces.

**Installation et Démarrage :** Clonez le repository et installez les dépendances avec `pnpm install`. Configurez les variables d'environnement dans `.env` (automatiquement injectées par la plateforme Manus). Poussez le schéma de base de données avec `pnpm db:push`. Démarrez le serveur de développement avec `pnpm dev`. L'application sera accessible sur `http://localhost:3000`.

**Développement Frontend :** Les composants React sont organisés par fonctionnalité dans `client/src/components/`. Utilisez les hooks tRPC pour communiquer avec le backend via `trpc.*.useQuery()` pour les lectures et `trpc.*.useMutation()` pour les modifications. Les mises à jour optimistes sont implémentées pour une expérience utilisateur fluide. Les composants shadcn/ui fournissent une base cohérente et accessible. Tailwind CSS permet un styling rapide et responsive.

**Développement Backend :** Les routes tRPC sont définies dans `server/routers.ts` avec une séparation claire entre routes publiques et protégées. Les fonctions d'accès à la base de données dans `server/db.ts` retournent des objets Drizzle typés. Utilisez `protectedProcedure` pour les routes nécessitant une authentification. La validation des entrées utilise Zod pour garantir la sécurité des types.

**Gestion de la Base de Données :** Modifiez le schéma dans `drizzle/schema.ts` en suivant la syntaxe Drizzle ORM. Générez et appliquez les migrations avec `pnpm db:push`. Drizzle génère automatiquement les types TypeScript correspondants. Pour des requêtes complexes, utilisez les helpers Drizzle comme `eq()`, `and()`, `gte()`, `lte()`, etc.

**Tests :** Exécutez tous les tests avec `pnpm test`. Les tests Vitest sont colocalisés avec le code dans `server/*.test.ts`. Créez un contexte d'authentification simulé pour tester les procédures protégées. Testez les cas nominaux et les cas d'erreur pour garantir la robustesse.

**Déploiement :** Créez un checkpoint avec `webdev_save_checkpoint` pour sauvegarder l'état actuel. Cliquez sur le bouton "Publish" dans l'interface de gestion Manus. L'application sera automatiquement déployée avec un domaine `*.manus.space`. Configurez un domaine personnalisé dans les paramètres si nécessaire.

---

## Composants Clés

### TaskCard.tsx

Le composant `TaskCard` représente une tâche individuelle avec toutes ses informations et actions possibles. Il affiche le titre, la description, la date d'échéance formatée en français, et un badge de priorité coloré. Les tâches de haute priorité non complétées reçoivent automatiquement la classe CSS `high-priority-alert` qui déclenche l'animation de pulsation rouge.

Les mutations tRPC utilisent des mises à jour optimistes pour une réactivité immédiate. Lorsque l'utilisateur clique sur "Marquer comme fait", l'interface se met à jour instantanément sans attendre la réponse du serveur. En cas d'erreur, l'état précédent est restauré et un message d'erreur est affiché via un toast.

Le composant gère trois actions principales : toggle (marquer comme fait/non fait), edit (ouvrir le formulaire d'édition), et delete (supprimer après confirmation). Chaque action invalide le cache analytics pour garantir que les statistiques restent synchronisées.

### TaskForm.tsx

Le composant `TaskForm` est un dialogue modal réutilisable pour créer ou éditer des tâches. Il détecte automatiquement le mode en fonction de la présence d'une tâche existante dans les props. Le formulaire contient quatre champs : titre (obligatoire), description (optionnelle), date d'échéance (optionnelle avec un input de type date), et priorité (select avec trois options).

La validation côté client vérifie que le titre n'est pas vide avant la soumission. Les mutations tRPC créent ou mettent à jour la tâche selon le mode. Après une opération réussie, le formulaire se réinitialise, le dialogue se ferme, et les caches tRPC sont invalidés pour rafraîchir les listes.

### TaskList.tsx

Le composant `TaskList` orchestre l'affichage et le filtrage des tâches. Il utilise des onglets pour permettre à l'utilisateur de basculer entre trois vues : toutes les tâches, uniquement les tâches actives, et uniquement les tâches terminées. Le compteur dans chaque onglet affiche le nombre de tâches correspondant.

Lorsqu'aucune tâche n'existe, un message d'état vide encourage l'utilisateur à créer sa première tâche. Les tâches sont affichées dans une grille responsive qui s'adapte automatiquement à la taille de l'écran : une colonne sur mobile, deux sur tablette, trois sur desktop.

### ProductivityScore.tsx

Le composant `ProductivityScore` visualise le score de productivité pour une période donnée. Il affiche le score en grand format avec une couleur dynamique : vert pour 80% et plus, jaune pour 50-79%, rouge en dessous de 50%. Un message d'encouragement adapté au score motive l'utilisateur.

Une barre de progression visuelle représente le score de manière intuitive. Trois statistiques détaillées montrent le nombre de tâches complétées, le nombre de tâches restantes, et le total des tâches. Le composant s'adapte automatiquement à la période (daily, weekly, monthly) en affichant le libellé approprié.

### Dashboard.tsx

La page `Dashboard` constitue le point d'entrée principal de l'application. Elle vérifie l'authentification au chargement et redirige vers la page de connexion Manus OAuth si nécessaire. L'en-tête affiche le titre de l'application, un message de bienvenue personnalisé avec le nom de l'utilisateur, et un bouton de déconnexion.

Le contenu principal utilise des onglets pour séparer la gestion des tâches et les statistiques. L'onglet Tâches intègre le composant `TaskList` qui gère toute la logique CRUD. L'onglet Statistiques affiche quatre cartes de statistiques globales suivies de trois cartes de scores de productivité pour les périodes quotidienne, hebdomadaire et mensuelle.

Un badge spécial "Perfectionniste" apparaît automatiquement lorsque le score quotidien atteint 100% avec au moins une tâche complétée, célébrant l'excellence de l'utilisateur avec un message de félicitations sur fond vert.

---

## Procédures tRPC

### tasks.list

Cette procédure protégée retourne toutes les tâches de l'utilisateur authentifié, triées par date de création décroissante. Elle ne prend aucun paramètre et utilise simplement `ctx.user.id` pour filtrer les tâches. Le résultat est un tableau d'objets Task avec tous les champs typés automatiquement par Drizzle.

### tasks.create

Cette procédure protégée crée une nouvelle tâche pour l'utilisateur authentifié. Elle valide les entrées avec Zod : titre obligatoire de 1 à 255 caractères, description optionnelle, date d'échéance optionnelle, priorité avec valeur par défaut "medium". La procédure insère la tâche dans la base de données avec `userId` automatiquement renseigné depuis le contexte d'authentification.

### tasks.update

Cette procédure protégée met à jour une tâche existante. Elle valide l'ID de la tâche et les champs optionnels à modifier. La fonction `updateTask` dans `db.ts` vérifie que la tâche appartient bien à l'utilisateur authentifié avant d'appliquer les modifications. Si la tâche n'existe pas ou n'appartient pas à l'utilisateur, undefined est retourné.

### tasks.delete

Cette procédure protégée supprime une tâche après vérification de propriété. Elle prend uniquement l'ID de la tâche en paramètre. La fonction `deleteTask` retourne true si la suppression a réussi, false sinon. Le frontend affiche une confirmation avant d'appeler cette procédure pour éviter les suppressions accidentelles.

### tasks.toggle

Cette procédure protégée bascule le statut de complétion d'une tâche. Elle récupère d'abord la tâche existante, inverse la valeur du champ `completed` (0 devient 1, 1 devient 0), et met à jour le champ `completedAt` avec la date actuelle si la tâche est marquée comme complétée, ou null si elle est marquée comme non complétée.

### analytics.dashboard

Cette procédure protégée calcule en temps réel toutes les statistiques pour le tableau de bord. Elle récupère toutes les tâches de l'utilisateur, puis les filtre par période en utilisant des comparaisons de dates JavaScript. Pour chaque période, elle compte le total de tâches, le nombre de tâches complétées, et calcule le score de productivité selon la formule (complétées / total) × 100 arrondi à l'entier le plus proche.

Les statistiques globales incluent également le nombre de tâches de haute priorité non complétées pour alerter l'utilisateur sur les éléments urgents nécessitant son attention. Cette approche de calcul en temps réel garantit que les statistiques sont toujours exactes sans nécessiter de tâches de fond ou de synchronisation complexe.

---

## Formules de Calcul

### Score de Productivité

Le score de productivité est calculé selon une formule simple et transparente qui reflète directement le taux de complétion des tâches.

**Formule de Base :**
```
Score (%) = (Tâches Complétées / Tâches Totales) × 100
```

**Cas Particulier :** Si aucune tâche n'existe pour la période considérée, le score est défini à 0% pour éviter une division par zéro et indiquer clairement l'absence d'activité.

**Arrondi :** Le score est arrondi à l'entier le plus proche pour faciliter la lecture et la compréhension. Un score de 87.5% sera affiché comme 88%.

### Périodes Temporelles

**Quotidien (Daily) :** Inclut toutes les tâches créées depuis minuit du jour actuel jusqu'à maintenant. Le calcul utilise `new Date(now.getFullYear(), now.getMonth(), now.getDate())` pour obtenir le début de la journée.

**Hebdomadaire (Weekly) :** Inclut toutes les tâches créées depuis le lundi de la semaine en cours jusqu'à maintenant. Le calcul utilise `today.getDate() - today.getDay()` pour trouver le lundi, en considérant que dimanche = 0.

**Mensuel (Monthly) :** Inclut toutes les tâches créées depuis le premier jour du mois actuel jusqu'à maintenant. Le calcul utilise `new Date(now.getFullYear(), now.getMonth(), 1)` pour obtenir le début du mois.

---

## Personnalisation et Extension

### Ajouter de Nouvelles Priorités

Pour ajouter un niveau de priorité supplémentaire, modifiez d'abord l'enum dans `drizzle/schema.ts` en ajoutant la nouvelle valeur à `mysqlEnum("priority", ["high", "medium", "low", "critical"])`. Poussez la migration avec `pnpm db:push`. Mettez à jour le composant `PriorityBadge.tsx` en ajoutant la configuration de couleur correspondante. Ajoutez l'option dans le select du formulaire `TaskForm.tsx`.

### Modifier les Couleurs de Priorité

Les couleurs sont définies dans `client/src/components/tasks/PriorityBadge.tsx`. Modifiez les classes Tailwind dans l'objet `priorityConfig` pour changer les couleurs. Les classes utilisent le format `bg-{color}-{intensity}` pour l'arrière-plan et `text-{color}` pour le texte. Assurez-vous de maintenir un contraste suffisant pour l'accessibilité.

### Ajouter de Nouveaux Badges

Pour créer un nouveau badge d'accomplissement, ajoutez la logique de détection dans `client/src/pages/Dashboard.tsx`. Créez une condition qui vérifie les critères du badge (par exemple, streak de 7 jours, 50 tâches complétées, etc.). Affichez un élément visuel similaire au badge Perfectionniste existant lorsque les critères sont remplis.

### Implémenter des Notifications

Installez la dépendance de notification avec `pnpm add`. Créez une procédure tRPC dans `server/routers.ts` qui utilise le helper `notifyOwner` fourni par le framework. Appelez cette procédure depuis le frontend lors d'événements importants (nouvelle tâche urgente, score de 100%, etc.). Les notifications apparaîtront dans l'interface de gestion Manus.

### Ajouter des Graphiques

Installez une bibliothèque de graphiques comme Recharts avec `pnpm add recharts`. Créez un nouveau composant dans `client/src/components/dashboard/` qui utilise les données analytics. Intégrez le composant dans la page Dashboard. Les données historiques peuvent être récupérées via la procédure `analytics.history` qui est déjà implémentée mais non utilisée dans l'interface actuelle.

---

## Dépannage

### Les tâches ne s'affichent pas

Vérifiez que vous êtes bien authentifié en consultant le message de bienvenue dans l'en-tête. Ouvrez la console du navigateur pour détecter d'éventuelles erreurs JavaScript. Vérifiez que le serveur backend est démarré et accessible. Testez la procédure `tasks.list` directement dans les tests pour isoler le problème.

### Les scores de productivité sont incorrects

Vérifiez que les tâches ont bien des dates de création correctes dans la base de données. Assurez-vous que le fuseau horaire du serveur est configuré correctement. Testez la procédure `analytics.dashboard` dans Vitest pour vérifier les calculs. Vérifiez que les filtres de période utilisent les bonnes comparaisons de dates.

### L'animation de pulsation ne fonctionne pas

Vérifiez que le fichier `client/src/index.css` contient bien la définition de l'animation `@keyframes pulse-red` et la classe `.high-priority-alert`. Assurez-vous que le composant `TaskCard` applique correctement la classe conditionnelle `isHighPriority ? "high-priority-alert" : ""`. Vérifiez dans l'inspecteur du navigateur que la classe est bien présente sur l'élément DOM.

### Erreurs TypeScript après modification du schéma

Après avoir modifié `drizzle/schema.ts`, exécutez toujours `pnpm db:push` pour générer les nouveaux types. Redémarrez le serveur TypeScript dans votre éditeur si nécessaire. Vérifiez que tous les imports utilisent les types exportés depuis `drizzle/schema.ts`. Si les erreurs persistent, supprimez le dossier `node_modules/.vite` et redémarrez le serveur de développement.

### Les mutations tRPC échouent silencieusement

Vérifiez la console du navigateur pour les erreurs réseau ou les erreurs tRPC. Assurez-vous que les procédures utilisent `protectedProcedure` et que l'utilisateur est authentifié. Vérifiez que la validation Zod des inputs correspond aux données envoyées. Ajoutez des logs côté serveur dans `server/routers.ts` pour déboguer le flux d'exécution.

---

## Prochaines Étapes Recommandées

Pour continuer à améliorer Maiden Task Manager, plusieurs fonctionnalités peuvent être envisagées.

**Système de Tags et Catégories :** Permettre aux utilisateurs de créer des tags personnalisés et de catégoriser leurs tâches pour une meilleure organisation. Ajouter une table `tags` et une table de jointure `task_tags` dans le schéma. Implémenter un composant de sélection multiple de tags dans le formulaire de tâche.

**Récurrence des Tâches :** Implémenter la possibilité de créer des tâches récurrentes (quotidiennes, hebdomadaires, mensuelles). Ajouter un champ `recurrence` dans la table tasks avec les options de fréquence. Créer une tâche de fond qui génère automatiquement les nouvelles instances des tâches récurrentes.

**Collaboration et Partage :** Permettre aux utilisateurs de partager des tâches ou des listes avec d'autres utilisateurs. Ajouter une table `shared_tasks` avec les permissions appropriées. Implémenter des notifications en temps réel lorsqu'une tâche partagée est modifiée.

**Pièces Jointes :** Permettre l'ajout de fichiers ou d'images aux tâches. Utiliser le helper `storagePut` fourni par le framework pour uploader les fichiers vers S3. Stocker les URLs et métadonnées des fichiers dans une table `task_attachments`.

**Recherche et Filtres Avancés :** Implémenter une barre de recherche pour trouver rapidement des tâches par titre ou description. Ajouter des filtres avancés par date, priorité, statut, tags, etc. Utiliser des requêtes Drizzle optimisées avec des index appropriés pour maintenir les performances.

**Export de Données :** Permettre aux utilisateurs d'exporter leurs tâches et statistiques en CSV ou PDF. Créer une procédure tRPC qui génère le fichier à la demande. Utiliser une bibliothèque comme `papaparse` pour CSV ou `pdfkit` pour PDF.

**Mode Hors Ligne :** Implémenter un Service Worker pour permettre l'utilisation de l'application sans connexion internet. Utiliser IndexedDB pour stocker localement les tâches. Synchroniser automatiquement avec le serveur lorsque la connexion est rétablie.

**Thème Personnalisable :** Étendre le système de thème actuel pour permettre aux utilisateurs de choisir leurs couleurs préférées. Stocker les préférences de thème dans la table users. Appliquer dynamiquement les variables CSS en fonction des préférences.

---

## Crédits et Licence

**Développé par :** Manus AI

**Framework :** Application construite sur la plateforme Manus avec React, Express, tRPC et Drizzle ORM

**Composants UI :** shadcn/ui (https://ui.shadcn.com/) basé sur Radix UI

**Icônes :** Lucide React (https://lucide.dev/)

**Authentification :** Manus OAuth intégré

**Hébergement :** Plateforme Manus (https://manus.im)

---

## Support et Contact

Pour toute question, suggestion ou problème technique concernant Maiden Task Manager, veuillez soumettre votre demande sur la page d'assistance officielle : **https://help.manus.im**

L'équipe support Manus se fera un plaisir de vous aider avec toute question relative à l'application, au déploiement, à la configuration ou aux fonctionnalités.
