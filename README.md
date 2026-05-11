# Hospitalisation Back

Microservice NestJS (`apps/clinique`) pour le domaine **Clinique / Hospitalisation** du SIH.

Architecture API hybride:
- **REST** pour les commandes transactionnelles et actions à effet de bord.
- **GraphQL** pour les lectures agrégées.
- **Règle de conception**: controllers REST et resolvers GraphQL délèguent aux mêmes services (logique métier centralisée).

## Stack technique

- NestJS 11
- TypeORM 0.3 + PostgreSQL
- GraphQL (Apollo)
- Swagger / OpenAPI
- Validation `class-validator`

## Prérequis

- Node.js 20+ recommandé
- npm 10+
- PostgreSQL
- (optionnel) Docker / Docker Compose

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env` et adapter les variables.

Variables principales utilisées:
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `CLINIQUE_PORT` (défaut: `3001`)
- `GRAPHQL_PLAYGROUND_ENABLED` (`true`/`false`)
- `SECURITY_PROFILE_HEADER` (défaut: `x-profile`)
- `SECURITY_ALLOWED_PROFILES` (défaut: `ONM,ONIM`)

## Lancement

### En local (dev)

```bash
npm run start:dev
```

### Build + run

```bash
npm run build
npm run start
```

### Avec Docker

```bash
docker compose up --build
```

## Endpoints

- API REST base: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- GraphQL: `http://localhost:3001/graphql`

## Sécurité / Auth

Les routes protégées utilisent `JwtAuthGuard` + `RolesGuard`.

Headers attendus:
- `Authorization: Bearer <token>`
- `x-profile: <profil>` (ex: `ONM`, `ONIM`)
- `x-user-id: <id utilisateur>`
- `x-order-number: <numero ordre>` pour signatures critiques

## Modules métier actuels

- `hospitalisation`: admissions, affectations de lit, transferts, demandes d'avis, avis médicaux, diagnostics, prescriptions, sorties.
- `cpa`: consultation pré-anesthésique.
- `vpa`: visite pré-anesthésique.
- `signature`: validation d'ordre professionnel.
- `patient`: vue dossier patient agrégée (CPA/VPA).

## Règles métier clés implémentées

- Une admission/transfert doit cibler un **lit disponible** dans le service.
- À l’affectation, le lit passe à `OCCUPE`; lors de sortie/changement, il repasse à `DISPONIBLE`.
- VPA interdite si CPA associée non `REALISE`.
- Demande d’avis: relance toutes les 5 minutes jusqu’à consultation.
- Diagnostics / avis / prescriptions critiques vérifient le numéro d’ordre via le module `signature`.

## Exemples REST utiles

- Créer une hospitalisation: `POST /hospitalisations`
- Affecter un lit: `POST /hospitalisations/affectations-lits`
- Créer une demande de transfert: `POST /hospitalisations/demandes-transfert`
- Traiter un transfert: `PATCH /hospitalisations/demandes-transfert/:id`
- Créer une demande d'avis: `POST /hospitalisations/demandes-avis`
- Marquer consultation avis: `PATCH /hospitalisations/demandes-avis/:id/consulter`
- Créer diagnostic: `POST /hospitalisations/diagnostics`
- Créer avis médical: `POST /hospitalisations/avis-medical`
- Créer prescription: `POST /hospitalisations/prescriptions`
- Clôturer hospitalisation: `PATCH /hospitalisations/:id/cloture`

## Structure source (résumé)

```text
apps/clinique/src/
  app.module.ts
  main.ts
  common/
    decorators/
    guards/
  modules/
    cpa/
    hospitalisation/
    patient/
    signature/
    vpa/
```

## Vérification rapide

```bash
npm run build
```

Si le build passe, le service est cohérent côté TypeScript.

## Déploiement Render

Pour Render, utilise un **Web Service** + une **PostgreSQL** Render.

### Variables Render

Renseigne au minimum :
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `SECURITY_CORS_ORIGINS` (ex: l'URL de ton frontend Render)

### Commandes Render

- Build: `npm install && npm run build`
- Start: `npm start`

### Point important

L'application écoute maintenant sur `PORT` si Render le fournit, sinon sur `CLINIQUE_PORT` en local.

### URLs exposées

- REST: `/`
- Swagger: `/api/docs`
- GraphQL: `/graphql`
