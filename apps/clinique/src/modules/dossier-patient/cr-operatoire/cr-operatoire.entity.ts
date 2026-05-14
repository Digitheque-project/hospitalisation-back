import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cr_operatoires')
export class CrOperatoire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  // Infos intervention
  @Column({ nullable: true })
  dateIntervention: string;

  @Column({ nullable: true })
  typeChirurgie: string;

  @Column({ nullable: true })
  chirurgien: string;

  @Column({ nullable: true })
  anesthesiste: string;

  @Column({ nullable: true })
  typeAnesthesie: string;

  @Column({ nullable: true })
  dureeIntervention: string;

  // Checklist OMS - Moment 1 : Avant induction
  @Column({ type: 'jsonb', nullable: true })
  checklistAvantInduction: {
    identiteConfirmee: boolean;
    siteMarque: boolean;
    consentementSigne: boolean;
    materielVerifie: boolean;
    risqueHemorragique: boolean;
    allergiesVerifiees: boolean;
    commentaire: string;
  };

  // Checklist OMS - Moment 2 : Avant incision
  @Column({ type: 'jsonb', nullable: true })
  checklistAvantIncision: {
    equipeIntroduite: boolean;
    confirmationPatient: boolean;
    antibioprophylaxie: boolean;
    imagerieDispo: boolean;
    problemesAnticipes: boolean;
    commentaire: string;
  };

  // Checklist OMS - Moment 3 : Avant sortie bloc
  @Column({ type: 'jsonb', nullable: true })
  checklistAvantSortie: {
    nomInstrumentsVerifie: boolean;
    pieceAnatomiqueLabelisee: boolean;
    problemesEquipement: boolean;
    consignesPostOp: boolean;
    commentaire: string;
  };

  // Protocole opératoire
  @Column({ type: 'text', nullable: true })
  protocoleOperatoire: string;

  @Column({ type: 'text', nullable: true })
  incidentPerOp: string;

  @Column({ nullable: true })
  perteSanguine: string;

  @Column({ nullable: true })
  transfusion: string;

  // Prescription post-op
  @Column({ type: 'jsonb', nullable: true })
  prescriptionPostOp: Array<{
    medicament: string;
    dose: string;
    frequence: string;
    duree: string;
  }>;

  // Repères post-opératoires J[i]
  @Column({ type: 'jsonb', nullable: true })
  suiviPostOp: Array<{
    jour: string;
    type: string; // 'PO' | 'H'
    observation: string;
    constantes: string;
    date: string;
  }>;

  @Column({ nullable: true })
  statut: string; // PLANIFIE | EN_COURS | TERMINE

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
