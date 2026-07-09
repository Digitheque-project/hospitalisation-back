import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Schéma initial consolidé du microservice Hospitalisation (clinique).
 *
 * Cette migration crée l'intégralité du schéma dans son état final :
 *  - chambre, lit, hospitalisation_episode (avec tous les champs de sortie),
 *  - demande (avec motif_refus).
 *
 * Elle remplace les anciennes migrations incrémentales (base de données neuve).
 * NB : la colonne "exeatable" de l'ancienne migration orpheline
 * (timestamp dupliqué, absente de l'entité et de index.ts) a été
 * volontairement retirée car elle n'existe pas dans les entités.
 */
export class InitialSchema1718880000000 implements MigrationInterface {
  name = "InitialSchema1718880000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // chambre
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // lit
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // hospitalisation_episode (avec tous les champs de sortie)
    // ------------------------------------------------------------------
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
        "mode_sortie" character varying(40),
        "etat_sortie" character varying(120),
        "motif_sortie" text,
        "resume_sortie" text,
        "diagnostic_final" text,
        "traitement_sortie" text,
        "conduite_a_tenir" text,
        "rendez_vous_controle" text,
        "destination_service_id" character varying(120),
        "destination_etablissement" character varying(255),
        "moyen_transport" character varying(120),
        "date_deces" TIMESTAMP,
        "cause_deces" text,
        "certificat_deces_numero" character varying(120),
        "motif_contre_avis" text,
        "risques_expliques" text,
        "signature_patient" boolean,
        "frais_regles" boolean NOT NULL DEFAULT false,
        "statut_paiement_sortie" character varying(40) NOT NULL DEFAULT 'NON_VERIFIE',
        "reference_paiement" character varying(120),
        "commentaire_paiement" text,
        "frais_regles_par" character varying(120),
        "frais_regles_at" TIMESTAMP,
        "sortie_medicale_validee" boolean NOT NULL DEFAULT false,
        "sortie_administrative_validee" boolean NOT NULL DEFAULT false,
        "created_by" character varying(120) NOT NULL,
        "updated_by" character varying(120),
        "validated_by" character varying(120),
        "validated_at" TIMESTAMP,
        "commentaire_sortie" text,
        "exeatable" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_id_episode" PRIMARY KEY ("id_episode")
      )
    `);

    // ------------------------------------------------------------------
    // demande (avec motif_refus)
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "demande" (
        "id" character varying(120) NOT NULL,
        "motif" text NOT NULL,
        "patient_id" character varying(120) NOT NULL,
        "service_id" character varying(120) NOT NULL,
        "chu_id" character varying(120) NOT NULL,
        "statut" character varying(40) NOT NULL DEFAULT 'EN_ATTENTE',
        "info_complementaire" text,
        "motif_refus" text,
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
    await queryRunner.query(`DROP TABLE "hospitalisation_episode"`);
    await queryRunner.query(`DROP TABLE "lit"`);
    await queryRunner.query(`DROP TABLE "chambre"`);
  }
}
