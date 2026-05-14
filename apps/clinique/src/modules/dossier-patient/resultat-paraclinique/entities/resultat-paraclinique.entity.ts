import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


export enum TypeExamen {
  LABORATOIRE = 'laboratoire',
  IMAGERIE = 'imagerie',
  ENDOSCOPIE = 'endoscopie',
  ANATOMOPATHOLOGIE = 'anatomopathologie',
  AUTRE = 'autre',
}

export enum StatutResultat {
  DEMANDE = 'demande',
  EN_COURS = 'en_cours',
  DISPONIBLE = 'disponible',
  LU = 'lu',
}

@Entity('resultats_paracliniques')
export class ResultatParaclinique {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id', type: 'varchar' })
  patientId: string;



  @Column({ type: 'enum', enum: TypeExamen, default: TypeExamen.LABORATOIRE })
  type: TypeExamen;

  @Column({ type: 'varchar', length: 255 })
  examen: string;

  @Column({ name: 'date_demande', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  dateDemande: Date;

  @Column({ name: 'date_resultat', type: 'timestamptz', nullable: true })
  dateResultat: Date | null;

  @Column({ type: 'text', nullable: true })
  resultatTexte: string | null;

  @Column({ type: 'jsonb', nullable: true })
  resultatFichiers: string[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prescripteur: string | null;

  @Column({ type: 'enum', enum: StatutResultat, default: StatutResultat.DEMANDE })
  statut: StatutResultat;

  @Column({ type: 'text', nullable: true })
  commentaire: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
