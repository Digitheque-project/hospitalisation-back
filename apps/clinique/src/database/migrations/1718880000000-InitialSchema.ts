import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1718880000000 implements MigrationInterface {
  name = 'InitialSchema1718880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "chambre" (
        "id_chambre" character varying(120) NOT NULL,
        "service_id" character varying(120) NOT NULL,
        "chu_id" character varying(120) NOT NULL,
        "numero_chambre" integer NOT NULL,
        "type_chambre" character varying(120) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_id_chambre" PRIMARY KEY ("id_chambre")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "lit" (
        "id_lit" character varying(120) NOT NULL,
        "chambre_id" character varying(120) NOT NULL,
        "chu_id" character varying(120) NOT NULL,
        "code_lit" character varying(120) NOT NULL,
        "statut" character varying(40) NOT NULL DEFAULT 'DISPONIBLE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_id_lit" PRIMARY KEY ("id_lit"),
        CONSTRAINT "FK_lit_chambre" FOREIGN KEY ("chambre_id") REFERENCES "chambre"("id_chambre") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "hospitalisation_episode" (
        "id_episode" character varying(120) NOT NULL,
        "patient_id" character varying(120) NOT NULL,
        "chu_id" character varying(120) NOT NULL,
        "service_id" character varying(120) NOT NULL,
        "lit_id" character varying(120),
        "lit_code" character varying(80),
        "date_admission" TIMESTAMP NOT NULL,
        "date_sortie" TIMESTAMP,
        "motif_admission" text,
        "statut" character varying(40) NOT NULL,
        "created_by" character varying(120) NOT NULL,
        "updated_by" character varying(120),
        "commentaire_sortie" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_id_episode" PRIMARY KEY ("id_episode")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hospitalisation_episode"`);
    await queryRunner.query(`DROP TABLE "lit"`);
    await queryRunner.query(`DROP TABLE "chambre"`);
  }
}
