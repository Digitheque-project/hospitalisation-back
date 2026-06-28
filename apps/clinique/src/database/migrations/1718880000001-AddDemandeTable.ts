import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDemandeTable1718880000001 implements MigrationInterface {
  name = 'AddDemandeTable1718880000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "demande" (
        "id" character varying(120) NOT NULL,
        "motif" text NOT NULL,
        "patient_id" character varying(120) NOT NULL,
        "service_id" character varying(120) NOT NULL,
        "chu_id" character varying(120) NOT NULL,
        "statut" character varying(40) NOT NULL DEFAULT 'EN_ATTENTE',
        "info_complementaire" text,
        "created_by" character varying(120) NOT NULL,
        "updated_by" character varying(120),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_demande" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "demande"`);
  }
}
