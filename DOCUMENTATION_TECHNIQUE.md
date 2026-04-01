# Documentation Technique - SalesScout (MaLogistics)

## Vue d'ensemble

L'application SalesScout est une application Angular 18 qui utilise Server-Side Rendering (SSR) avec Express. Elle est conçue pour être déployée dans un environnement conteneurisé (Docker).

## Architecture

- **Frontend** : Angular 18 (utilisant `@angular/ssr` pour le rendu côté serveur).
- **Backend (SSR)** : Express.js, qui sert l'application Angular pré-rendue et gère les fichiers statiques.
- **Base de données** : (Non spécifié dans les fichiers fournis, mais l'application semble utiliser des API REST via `HttpClient`).

## Structure du Projet

- `src/` : Code source de l'application Angular.
  - `app/` : Composants et modules principaux.
  - `main.ts` : Point d'entrée pour le navigateur.
  - `main.server.ts` : Point d'entrée pour le serveur (SSR).
- `server.ts` : Configuration du serveur Express pour SSR.
- `angular.json` : Configuration de l'espace de travail Angular CLI.
- `package.json` : Dépendances et scripts npm.
- `Dockerfile` : Instructions pour la création de l'image Docker.

## Scripts npm

Les scripts principaux définis dans `package.json` sont :

- `start` : `ng serve` - Lance le serveur de développement.
- `build` : `ng build` - Construit l'application pour la production (avec SSR).
- `watch` : `ng build --watch --configuration development` - Construit l'application en mode watch.
- `test` : `ng test` - Lance les tests unitaires.
- `serve:ssr:MaLogistics` : `node dist/sales-scout/server/server.mjs` - Lance le serveur SSR compilé.

## Configuration Docker

Le fichier `Dockerfile` utilise une approche multi-stage build pour optimiser la taille de l'image finale.

1.  **Stage Build (`build`)** :
    - Image de base : `node:20-alpine`.
    - Installe les dépendances (`npm install`).
    - Construit l'application (`npm run build`).

2.  **Stage Runtime** :
    - Image de base : `node:20-alpine`.
    - Copie uniquement les artefacts de build nécessaires (`dist/sales-scout`).
    - Expose le port 4000.
    - Commande de démarrage : `node dist/sales-scout/server/server.mjs`.

## Remarques Techniques

- L'application utilise `CommonEngine` de `@angular/ssr` pour gérer le rendu.
- Le fichier `server.ts` configure Express pour servir les fichiers statiques depuis `dist/sales-scout/browser` et déléguer le reste des requêtes au moteur de rendu Angular.
- **Important** : Assurez-vous que le fichier `dist/sales-scout/server/server.mjs` est bien généré lors du build. Si ce n'est pas le cas, vérifiez la configuration `angular.json`.
