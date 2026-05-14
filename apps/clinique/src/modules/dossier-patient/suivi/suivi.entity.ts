import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('suivis')
export class Suivi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'jour_hospitalisation', nullable: true })
  jourHospitalisation: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ name: 'ta_systolique', nullable: true })
  taSystolique: string;

  @Column({ name: 'ta_diastolique', nullable: true })
  taDiastolique: string;

  @Column({ name: 'frequence_cardiaque', nullable: true })
  frequenceCardiaque: string;

  @Column({ name: 'frequence_respiratoire', nullable: true })
  frequenceRespiratoire: string;

  @Column({ name: 'eva_douleur', type: 'int', nullable: true })
  evaDouleur: number;

  @Column({ name: 'etat_general', nullable: true })
  etatGeneral: string;

  @Column({ name: 'examen_clinique', type: 'text', nullable: true })
  examenClinique: string;

  @Column({ type: 'text', nullable: true })
  evolution: string;

  @Column({ name: 'signes_alerte', default: false })
  signesAlerte: boolean;

  @Column({ name: 'auteur', nullable: true })
  auteur: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
