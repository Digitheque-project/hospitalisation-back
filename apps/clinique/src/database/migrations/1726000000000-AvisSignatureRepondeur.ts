import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fige l'identite du praticien consultant sur le compte-rendu d'avis.
 *
 * On denormalise nom / prenom / fonction au lieu de resoudre `repondeurId` a
 * chaque affichage : un compte-rendu signe doit conserver l'auteur tel qu'il
 * etait au moment de la signature (equivalent de Provenance.agent en HL7 FHIR).
 * Si le praticien change de role, de service, ou quitte le CHU, l'avis rendu en
 * juillet doit continuer d'afficher son signataire d'alors.
 *
 * Idempotente (IF NOT EXISTS) et rejouable. Les avis deja repondus gardent des
 * colonnes vides : l'identite n'etait pas capturee a l'epoque, et il serait
 * faux de la reconstituer aujourd'hui a partir du referentiel courant.
 */
export class AvisSignatureRepondeur1726000000000 implements MigrationInterface {
  name = 'AvisSignatureRepondeur1726000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "avis"
        ADD COLUMN IF NOT EXISTS "repondeurNom" character varying(120),
        ADD COLUMN IF NOT EXISTS "repondeurPrenom" character varying(120),
        ADD COLUMN IF NOT EXISTS "repondeurFonction" character varying(120)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "avis"
        DROP COLUMN IF EXISTS "repondeurFonction",
        DROP COLUMN IF EXISTS "repondeurPrenom",
        DROP COLUMN IF EXISTS "repondeurNom"
    `);
  }
}
