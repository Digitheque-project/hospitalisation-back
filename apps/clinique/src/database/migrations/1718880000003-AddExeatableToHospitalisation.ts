import { MigrationInterface, QueryRunner } from 'typeorm';
​
// [Ajout requete UI] Colonne "exeatable" persistante sur les episodes
// d'hospitalisation. Elle permet de conserver l'etat du toggle "Exeatable" de la
// carte lit apres un rafraichissement de page ou une deconnexion, tant que
// l'utilisateur ne le desactive pas explicitement (avec confirmation cote UI).
export class AddExeatableToHospitalisation1718880000003
  implements MigrationInterface
{
  name = 'AddExeatableToHospitalisation1718880000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "hospitalisation_episode"
      ADD COLUMN "exeatable" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "hospitalisation_episode"
      DROP COLUMN "exeatable"
    `);
  }
}