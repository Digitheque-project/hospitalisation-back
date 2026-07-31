import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Chainage des transferts internes.
 *
 * - hospitalisation_episode.episodePrecedentId : episode d'origine dont cet
 *   episode est la suite (parcours patient continu entre services).
 * - demande.episodeSourceId : episode source du transfert interne ayant
 *   genere la demande d'admission dans le service destinataire.
 */
export class AddTransfertChainage1724000000000 implements MigrationInterface {
  name = 'AddTransfertChainage1724000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "hospitalisation_episode"
      ADD COLUMN IF NOT EXISTS "episodePrecedentId" character varying(120)
    `);
    await queryRunner.query(`
      ALTER TABLE "demande"
      ADD COLUMN IF NOT EXISTS "episodeSourceId" character varying(120)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_episode_precedent"
      ON "hospitalisation_episode" ("episodePrecedentId")
    `);
    // Une seule demande de transfert par episode source (idempotence de la
    // cloture : re-jouer un transfert ne doit pas creer de doublon).
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_demande_episode_source"
      ON "demande" ("episodeSourceId") WHERE "episodeSourceId" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_demande_episode_source"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_episode_precedent"`);
    await queryRunner.query(`ALTER TABLE "demande" DROP COLUMN IF EXISTS "episodeSourceId"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "episodePrecedentId"`);
  }
}
