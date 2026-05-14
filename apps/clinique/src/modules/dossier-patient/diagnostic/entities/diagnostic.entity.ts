import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('diagnostics')
export class Diagnostic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id', type: 'varchar' })
  patientId: string;



  @Column({ type: 'text', nullable: true })
  diagnosticRetenu: string;

  @Column({ type: 'jsonb', nullable: true })
  hypotheses: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  gravite: string;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  medecin: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
