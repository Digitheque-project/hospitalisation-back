import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMotifRefusToDemande1718880000002 implements MigrationInterface {
  name = 'AddMotifRefusToDemande1718880000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demande"
      ADD COLUMN "motif_refus" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demande"
      DROP COLUMN "motif_refus"
    `);
  }
}
