import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('diagnostics')
export class Diagnostic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'diagnostic_principal', type: 'text' })
  diagnosticPrincipal: string;

  @Column({ name: 'diagnostics_secondaires', type: 'text', nullable: true })
  diagnosticsSecondaires: string;

  @Column({ name: 'justification_clinique', type: 'text', nullable: true })
  justificationClinique: string;

  @Column({ name: 'diagnostics_differentiels', type: 'text', nullable: true })
  diagnosticsDifferentiels: string;

  @Column({ name: 'gravite_stade', type: 'text', nullable: true })
  graviteStade: string;

  @Column({ name: 'medecin_responsable', type: 'varchar', nullable: true })
  medecinResponsable: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
