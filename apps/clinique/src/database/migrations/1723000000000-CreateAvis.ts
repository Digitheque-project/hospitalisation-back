import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Table `avis` : demandes d'avis inter-services.
 *
 * Jumelle de `demande` mais SANS episode : le patient reste dans son service
 * source. Ajoute `urgence` (PROGRAMMEE/URGENTE/VITALE) et `reponse` (compte-
 * rendu du consultant, rempli au passage a REPONDUE).
 */
export class CreateAvis1723000000000 implements MigrationInterface {
  name = 'CreateAvis1723000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "avis" (
        "id" character varying(120) NOT NULL,
        "motif" text NOT NULL,
        "patientId" character varying(36) NOT NULL,
        "serviceIdSource" uuid NOT NULL,
        "serviceIdDest" uuid NOT NULL,
        "chuId" uuid NOT NULL,
        "urgence" character varying(40) NOT NULL DEFAULT 'PROGRAMMEE',
        "statut" character varying(40) NOT NULL DEFAULT 'EN_ATTENTE',
        "infoComplementaire" text,
        "reponse" text,
        "motifRefus" text,
        "createdBy" uuid NOT NULL,
        "updatedBy" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_avis" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "avis"`);
  }
}
