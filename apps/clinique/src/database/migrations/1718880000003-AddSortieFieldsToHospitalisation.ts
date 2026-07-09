import { MigrationInterface, QueryRunner } from 'typeorm';
​
export class AddSortieFieldsToHospitalisation1718880000003 implements MigrationInterface {
  name = 'AddSortieFieldsToHospitalisation1718880000003';
​
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "mode_sortie" character varying(40)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "etat_sortie" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "motif_sortie" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "resume_sortie" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "diagnostic_final" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "traitement_sortie" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "conduite_a_tenir" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "rendez_vous_controle" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "destination_service_id" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "destination_etablissement" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "moyen_transport" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "date_deces" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "cause_deces" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "certificat_deces_numero" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "motif_contre_avis" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "risques_expliques" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "signature_patient" boolean`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "frais_regles" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "statut_paiement_sortie" character varying(40) NOT NULL DEFAULT 'NON_VERIFIE'`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "reference_paiement" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "commentaire_paiement" text`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "frais_regles_par" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "frais_regles_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "sortie_medicale_validee" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "sortie_administrative_validee" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "validated_by" character varying(120)`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" ADD COLUMN IF NOT EXISTS "validated_at" TIMESTAMP`);
  }
​
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "validated_at"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "validated_by"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "sortie_administrative_validee"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "sortie_medicale_validee"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "frais_regles_at"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "frais_regles_par"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "commentaire_paiement"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "reference_paiement"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "statut_paiement_sortie"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "frais_regles"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "signature_patient"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "risques_expliques"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "motif_contre_avis"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "certificat_deces_numero"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "cause_deces"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "date_deces"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "moyen_transport"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "destination_etablissement"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "destination_service_id"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "rendez_vous_controle"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "conduite_a_tenir"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "traitement_sortie"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "diagnostic_final"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "resume_sortie"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "motif_sortie"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "etat_sortie"`);
    await queryRunner.query(`ALTER TABLE "hospitalisation_episode" DROP COLUMN IF EXISTS "mode_sortie"`);
  }
}
​