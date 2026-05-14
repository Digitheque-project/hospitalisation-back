import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id', type: 'varchar' })
  patientId: string;



  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'brouillon' })
  statut: string; // brouillon, valide, archive

  @Column({ type: 'varchar', length: 255, nullable: true })
  validePar: string;

  @Column({ type: 'timestamptz', nullable: true })
  dateValidation: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
