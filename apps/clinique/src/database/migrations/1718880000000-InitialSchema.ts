import { MigrationInterface, QueryRunner } from "typeorm";
​
/**
 * Schéma initial consolidé du microservice Hospitalisation (clinique).
 *
 * Convention de nommage des colonnes : camelCase (identique au microservice
 * dossier-patient) afin d'éviter toute confusion entre les services.
 * Les identifiants camelCase doivent être écrits entre guillemets doubles en SQL.
 *
 *  - chambre, lit, hospitalisation_episode (avec tous les champs de sortie),
 *  - demande (avec motifRefus).
 */
export class InitialSchema1718880000000 implements MigrationInterface {
  name = "InitialSchema1718880000000";
​
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // chambre
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "chambre" (
        "id" character varying(120) NOT NULL,
        "serviceId" uuid NOT NULL,
        "chuId" uuid NOT NULL,
        "numeroChambre" integer NOT NULL,
        "type" character varying(120) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chambre" PRIMARY KEY ("id")
      )
    `);
​
    // ------------------------------------------------------------------
    // lit
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "lit" (
        "id" character varying(120) NOT NULL,
        "chambreId" character varying(120) NOT NULL,
        "chuId" uuid NOT NULL,
        "codeLit" character varying(120) NOT NULL,
        "statut" character varying(40) NOT NULL DEFAULT 'DISPONIBLE',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lit" PRIMARY KEY ("id"),
        CONSTRAINT "FK_lit_chambre" FOREIGN KEY ("chambreId") REFERENCES "chambre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
​
    // ------------------------------------------------------------------
    // hospitalisation_episode (avec tous les champs de sortie)
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "hospitalisation_episode" (
        "id" character varying(120) NOT NULL,
        "patientId" character varying(36) NOT NULL,
        "chuId" uuid NOT NULL,
        "serviceId" uuid NOT NULL,
        "litId" character varying(120),
        "litCode" character varying(80),
        "dateAdmission" TIMESTAMP NOT NULL,
        "dateSortie" TIMESTAMP,
        "motifAdmission" text,
        "statut" character varying(40) NOT NULL,
        "modeSortie" character varying(40),
        "etatSortie" character varying(120),
        "motifSortie" text,
        "resumeSortie" text,
        "diagnosticFinal" text,
        "traitementSortie" text,
        "conduiteATenir" text,
        "rendezVousControle" text,
        "destinationServiceId" uuid,
        "destinationEtablissement" character varying(255),
        "moyenTransport" character varying(120),
        "dateDeces" TIMESTAMP,
        "causeDeces" text,
        "certificatDecesNumero" character varying(120),
        "motifContreAvis" text,
        "risquesExpliques" text,
        "signaturePatient" boolean,
        "fraisRegles" boolean NOT NULL DEFAULT false,
        "statutPaiementSortie" character varying(40) NOT NULL DEFAULT 'NON_VERIFIE',
        "referencePaiement" character varying(120),
        "commentairePaiement" text,
        "fraisReglesPar" uuid,
        "fraisReglesAt" TIMESTAMP,
        "sortieMedicaleValidee" boolean NOT NULL DEFAULT false,
        "sortieAdministrativeValidee" boolean NOT NULL DEFAULT false,
        "createdBy" uuid NOT NULL,
        "updatedBy" uuid,
        "validatedBy" uuid,
        "validatedAt" TIMESTAMP,
        "commentaireSortie" text,
        "exeatable" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_episode" PRIMARY KEY ("id")
      )
    `);
​
    // ------------------------------------------------------------------
    // demande
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "demande" (
        "id" character varying(120) NOT NULL,
        "motif" text NOT NULL,
        "patientId" character varying(36) NOT NULL,
        "serviceIdSource" uuid NOT NULL,
        "serviceIdDest" uuid NOT NULL,
        "chuId" uuid NOT NULL,
        "statut" character varying(40) NOT NULL DEFAULT 'EN_ATTENTE',
        "infoComplementaire" text,
        "motifRefus" text,
        "createdBy" uuid NOT NULL,
        "updatedBy" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_demande" PRIMARY KEY ("id")
      )
    `);
  }
​
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "demande"`);
    await queryRunner.query(`DROP TABLE "hospitalisation_episode"`);
    await queryRunner.query(`DROP TABLE "lit"`);
    await queryRunner.query(`DROP TABLE "chambre"`);
  }
}