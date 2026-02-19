# Guide de Déploiement

Ce document décrit la procédure pour construire et déployer l'application SalesScout à l'aide de Docker.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur la machine.
- Accès au code source.

## Construction de l'image Docker

1.  Ouvrez un terminal à la racine du projet.
2.  Exécutez la commande suivante pour construire l'image Docker :

    ```bash
    docker build -t sales-scout .
    ```

    Cette commande va :
    - Installer les dépendances.
    - Construire l'application Angular (SSR).
    - Créer une image optimisée pour l'exécution.

## Lancement du conteneur

Une fois l'image construite, vous pouvez lancer l'application avec la commande suivante :

```bash
docker run -p 4000:4000 sales-scout
```

L'application sera accessible à l'adresse [http://localhost:4000](http://localhost:4000).

## Déploiement en Production

Pour un déploiement en production, il est recommandé d'utiliser un orchestrateur comme Docker Swarm ou Kubernetes, ou un service de cloud (AWS ECS, Google Cloud Run, Azure Container Instances).

### Exemple avec Docker Compose

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'
services:
  app:
    image: sales-scout
    build: .
    ports:
      - "4000:4000"
    restart: always
```

Puis lancez :

```bash
docker-compose up -d
```

## Résolution des problèmes

- **Erreur de build** : Vérifiez que vous avez bien accès à Internet pour télécharger les paquets npm.
- **Port déjà utilisé** : Si le port 4000 est occupé, modifiez le mapping de port : `docker run -p 8080:4000 sales-scout`.
