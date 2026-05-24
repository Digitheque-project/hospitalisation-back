# Hospitalisation Back (Minimal)

Microservice NestJS (`apps/clinique`) dedie a la **gestion basique des episodes d hospitalisation**.

Principes:
- REST pour les commandes.
- GraphQL pour les lectures.
- Controllers REST et resolvers GraphQL deleguent aux memes services.

## Perimetre

Inclus:
- Creation d un episode d hospitalisation
- Mise a jour du statut global (ADMIS, EN_COURS, TRANSFERE, SORTIE, DECEDE, EVADE)
- Liaison simple avec le patient via `patientId` (validation via Accueil)
- Affectation basique de service / lit
- Gestion des chambres et des lits
- Plan de lits par service
- Cloture d episode sans compte-rendu detaille
- Evenements Kafka simples

Exclus:
- CPA, VPA, bloc operatoire, demandes d avis, prescriptions, historique clinique detaille
- Dossier patient avance, observations, diagnostics, parcours clinique

## Stack technique

- NestJS 11
- TypeORM 0.3 + PostgreSQL
- GraphQL (Apollo)
- Swagger / OpenAPI
- Validation `class-validator`
- Kafka (events)

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env` et adapter les variables.

Variables principales:
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC` (defaut: `false` en prod)
- `CLINIQUE_PORT` (defaut: `3001`)
- `ACCUEIL_API_BASE_URL`
- `KAFKA_BROKERS`
- `KAFKA_CLIENT_ID`

## Lancement

```bash
npm run start:dev
```

## Endpoints principaux (REST)

- `POST /hospitalisations` : creer un episode
- `PATCH /hospitalisations/:id/status` : mettre a jour le statut
- `PATCH /hospitalisations/:id/close` : cloturer l episode
- `GET /hospitalisations/:id` : recuperer un episode
- `GET /hospitalisations` : lister (serviceId obligatoire, filtres: `patientId`, `statut`)

- `POST /chambres` : creer une chambre
- `GET /chambres` : lister par serviceId (obligatoire)
- `GET /chambres/:id` : detail d une chambre
- `PATCH /chambres/:id` : modifier une chambre

- `POST /chambres/:chambreId/lits` : creer un ou plusieurs lits
- `GET /lits` : lister par chambreId ou serviceId
- `GET /lits/:id` : detail d un lit
- `PATCH /lits/:id` : modifier un lit

- `GET /plan-lits` : plan de lits par service (serviceId obligatoire)

Swagger: `http://localhost:3001/api/docs`
GraphQL: `http://localhost:3001/graphql`

## Kafka (events)

Topics emises:
- `hospitalisation.episode.created`
- `hospitalisation.episode.status.updated`
- `hospitalisation.episode.closed`

## Structure source (simplifiee)

```text
apps/clinique/src/
  app.module.ts
  main.ts
  common/
    decorators/
    guards/
  domain/
    entities/
  infrastructure/
    http-clients/
    kafka/
  modules/
    hospitalisation/
    chambre/
    lit/
```

## Build

```bash
npm run build
```

## Migrations (prod)

En production, on n'utilise pas `synchronize: true`.

Workflow conseille:
1. Ajouter une colonne nullable (ou avec une valeur par defaut).
2. Backfill des donnees existantes.
3. Ajouter la contrainte NOT NULL dans une migration suivante.

### Premiere mise en production (Docker)

1. Build et demarrer:

```bash
docker compose up --build -d
```

2. Appliquer les migrations versionnees:

```bash
docker compose exec clinique npm run migration:run
```

### Ajouter une colonne (schema evolve)

En **dev** uniquement:

```bash
docker compose run --rm clinique-dev npm run migration:generate
```

Puis commit le fichier genere dans `apps/clinique/src/database/migrations`.

En **prod** (apres deploy/build):

```bash
docker compose exec clinique npm run migration:run
```

### Autres commandes utiles

```bash
npm run migration:run
npm run migration:revert
```
