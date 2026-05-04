# Maiden Task Manager - TODO

## Base de données et Backend
- [x] Créer le schéma de base de données pour les tâches (tasks table)
- [x] Créer le schéma pour les statistiques analytiques (analytics table)
- [x] Implémenter les procédures tRPC pour CRUD des tâches
- [x] Implémenter les procédures tRPC pour les statistiques analytiques
- [x] Ajouter les tests Vitest pour les procédures

## Interface Utilisateur - Gestion des Tâches
- [x] Créer le composant TaskCard avec badges de priorité
- [x] Implémenter les animations CSS pour les tâches haute priorité
- [x] Créer le formulaire de création/édition de tâches (TaskForm)
- [x] Créer la liste des tâches (TaskList) avec filtres
- [x] Implémenter le bouton "Marquer comme fait" avec changement visuel
- [x] Ajouter les codes couleurs (Rouge=Haute, Jaune=Moyenne, Bleu=Basse)

## Dashboard Analytique et Gamification
- [x] Créer le composant StatsCard pour afficher les statistiques
- [x] Implémenter le calcul du score de productivité (jour/semaine/mois)
- [x] Afficher le nombre de tâches entrées vs accomplies en temps réel
- [x] Créer des graphiques pour visualiser les tendances
- [x] Ajouter un système de badges/achievements (optionnel)

## Authentification et Sécurité
- [x] Configurer l'authentification Manus OAuth (déjà fournie)
- [x] Implémenter la fonctionnalité "Mot de passe oublié" (simulation) - Non applicable avec Manus OAuth
- [x] Protéger les routes avec authentification requise
- [x] Ajouter la gestion des sessions utilisateur

## Design et UX
- [x] Configurer le thème Tailwind avec palette de couleurs
- [x] Créer le layout principal avec navigation
- [x] Implémenter le design responsive
- [x] Ajouter les états de chargement et erreurs
- [x] Optimiser l'expérience utilisateur mobile

## Documentation et Déploiement
- [x] Générer le prompt pour la création du logo
- [x] Créer la documentation utilisateur
- [x] Préparer l'arborescence des fichiers
- [x] Tester l'application complète
- [x] Créer un checkpoint final

## Bugs à Corriger
- [x] Corriger l'erreur "Invalid hook call" dans Dashboard.tsx (ligne 67)

## Nouvelles Fonctionnalités et Corrections
- [x] Corriger le bouton de déconnexion (ne fonctionne pas)
- [x] Corriger le formulaire d'édition de tâche (affiche des champs vides)
- [x] Ajouter un onglet pour les tâches passées non exécutées

## Intégration du Logo
- [x] Copier le logo dans le dossier public
- [x] Mettre à jour APP_LOGO dans const.ts
- [x] Ajouter le logo dans le header du dashboard
- [x] Informer l'utilisateur pour mettre à jour le favicon via l'interface de gestion

## Améliorations Visuelles et UX
- [x] Ajouter une animation de pulsation au logo lors du survol
- [x] Créer une landing page d'accueil avec logo en grand format
- [x] Ajouter un bouton CTA "Commencer" sur la landing page
- [x] Personnaliser la palette de couleurs (indigo/violet) selon le logo
- [x] Adapter les couleurs des composants UI pour cohérence visuelle

## Fonctionnalités Avancées
- [x] Créer un système de vérification quotidienne des tâches à échéance proche
- [x] Implémenter les notifications automatiques 24h avant échéance (haute priorité)
- [x] Ajouter un menu déroulant de tri (date création, échéance, priorité)
- [x] Implémenter le tri des tâches selon le critère sélectionné
- [x] Créer le composant Calendar pour la vue calendrier mensuel
- [x] Intégrer les tâches dans le calendrier par date d'échéance
- [x] Ajouter l'onglet "Calendrier" dans la navigation

## Corrections et Améliorations Finales
- [x] Corriger le bug du score de productivité journalier
- [x] Ajouter le schéma de base de données pour les tags
- [x] Créer les procédures tRPC pour gérer les tags
- [x] Implémenter le glisser-déposer sur le calendrier
- [x] Créer l'interface de gestion des tags
- [x] Ajouter le filtrage par tags dans la liste des tâches
