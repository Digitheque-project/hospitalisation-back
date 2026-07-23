import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Table `rapport` : rapports d'activite du service (RMA).
 *
 * Le contenu editable est stocke en JSONB. Seuls les rapports FINALISE sont
 * conserves durablement ; les BROUILLON abandonnes sont purges applicativement.
 */
export class CreateRapport1722000000000 implements MigrationInterface {
  name = 'CreateRapport1722000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "rapport" (
        "id" character varying(120) NOT NULL,
        "chuId" uuid NOT NULL,
        "serviceId" uuid NOT NULL,
        "title" character varying(200) NOT NULL,
        "templateId" character varying(80) NOT NULL,
        "periodType" character varying(40) NOT NULL,
        "periodLabel" character varying(120),
        "dateFrom" date,
        "dateTo" date,
        "statut" character varying(20) NOT NULL DEFAULT 'BROUILLON',
        "includeGraphiques" boolean NOT NULL DEFAULT false,
        "content" jsonb,
        "createdBy" uuid,
        "finalizedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rapport" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rapport_service" ON "rapport" ("chuId", "serviceId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_rapport_service"`);
    await queryRunner.query(`DROP TABLE "rapport"`);
  }
}
