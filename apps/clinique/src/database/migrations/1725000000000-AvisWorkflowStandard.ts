import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Aligne la demande d'avis sur le cycle de vie standard de la demande de
 * consultation (HL7 FHIR ServiceRequest / Task) : horodatage de chaque etape,
 * echeance de reponse derivee de l'urgence, accuse de lecture par le demandeur
 * et delai de reponse mesure.
 *
 * Idempotente (IF NOT EXISTS) et rejouable ; les avis existants sont repris au
 * mieux a partir de updatedAt/createdAt pour ne pas afficher des colonnes vides.
 */
export class AvisWorkflowStandard1725000000000 implements MigrationInterface {
  name = 'AvisWorkflowStandard1725000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "avis"
        ADD COLUMN IF NOT EXISTS "dateEcheanceReponse" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "dateConsultation" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "datePriseEnCharge" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "dateReponse" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "dateLectureReponse" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "dateCloture" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "delaiReponseMinutes" integer,
        ADD COLUMN IF NOT EXISTS "repondeurId" uuid,
        ADD COLUMN IF NOT EXISTS "reponseLuePar" uuid
    `);

    // Files de travail : avis recus a traiter / avis emis en attente de reponse.
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_avis_dest_statut" ON "avis" ("serviceIdDest", "statut")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_avis_source_statut" ON "avis" ("serviceIdSource", "statut")`,
    );

    // Reprise de l'historique : un avis deja repondu recoit sa date de reponse.
    await queryRunner.query(`
      UPDATE "avis"
         SET "dateReponse" = COALESCE("dateReponse", "updatedAt"),
             "delaiReponseMinutes" = COALESCE(
               "delaiReponseMinutes",
               GREATEST(0, (EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 60)::int)
             )
       WHERE "statut" IN ('REPONDUE', 'CLOTUREE', 'REFUSEE')
    `);

    await queryRunner.query(`
      UPDATE "avis"
         SET "dateCloture" = COALESCE("dateCloture", "updatedAt"),
             "dateLectureReponse" = COALESCE("dateLectureReponse", "updatedAt")
       WHERE "statut" = 'CLOTUREE'
    `);

    // Vocabulaire d'urgence aligne sur le reste du dossier patient :
    // PROGRAMMEE -> NORMAL, URGENTE -> URGENT, VITALE -> TRES_URGENT.
    await queryRunner.query(`
      UPDATE "avis"
         SET "urgence" = CASE "urgence"
                           WHEN 'PROGRAMMEE' THEN 'NORMAL'
                           WHEN 'URGENTE' THEN 'URGENT'
                           WHEN 'VITALE' THEN 'TRES_URGENT'
                           ELSE "urgence"
                         END
       WHERE "urgence" IN ('PROGRAMMEE', 'URGENTE', 'VITALE')
    `);

    await queryRunner.query(
      `ALTER TABLE "avis" ALTER COLUMN "urgence" SET DEFAULT 'NORMAL'`,
    );

    // Echeance retroactive selon l'urgence (1 h / 4 h / 48 h).
    await queryRunner.query(`
      UPDATE "avis"
         SET "dateEcheanceReponse" = "createdAt" + (
               CASE "urgence"
                 WHEN 'TRES_URGENT' THEN INTERVAL '1 hour'
                 WHEN 'URGENT' THEN INTERVAL '4 hours'
                 ELSE INTERVAL '48 hours'
               END
             )
       WHERE "dateEcheanceReponse" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Retour au vocabulaire precedent.
    await queryRunner.query(`
      UPDATE "avis"
         SET "urgence" = CASE "urgence"
                           WHEN 'NORMAL' THEN 'PROGRAMMEE'
                           WHEN 'URGENT' THEN 'URGENTE'
                           WHEN 'TRES_URGENT' THEN 'VITALE'
                           ELSE "urgence"
                         END
       WHERE "urgence" IN ('NORMAL', 'URGENT', 'TRES_URGENT')
    `);
    await queryRunner.query(
      `ALTER TABLE "avis" ALTER COLUMN "urgence" SET DEFAULT 'PROGRAMMEE'`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_avis_source_statut"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_avis_dest_statut"`);
    await queryRunner.query(`
      ALTER TABLE "avis"
        DROP COLUMN IF EXISTS "reponseLuePar",
        DROP COLUMN IF EXISTS "repondeurId",
        DROP COLUMN IF EXISTS "delaiReponseMinutes",
        DROP COLUMN IF EXISTS "dateCloture",
        DROP COLUMN IF EXISTS "dateLectureReponse",
        DROP COLUMN IF EXISTS "dateReponse",
        DROP COLUMN IF EXISTS "datePriseEnCharge",
        DROP COLUMN IF EXISTS "dateConsultation",
        DROP COLUMN IF EXISTS "dateEcheanceReponse"
    `);
  }
}
