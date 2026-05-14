import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sorties')
export class Sortie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ nullable: true })
  typeSortie: string; // NORMALE | TRANSFERT | CONTRE_AVIS | DECHARGE | DECES

  @Column({ nullable: true })
  dateSortieprevue: string;

  @Column({ nullable: true })
  medecinValidant: string;

  @Column({ type: 'text', nullable: true })
  compteRenduSortie: string;

  @Column({ type: 'text', nullable: true })
  suiviPostSortie: string;

  // Transfert
  @Column({ nullable: true })
  etablissementTransfert: string;

  @Column({ nullable: true })
  motifTransfert: string;

  @Column({ nullable: true })
  statutTransfert: string; // ACCEPTE | A_VOIR | REFUSE

  @Column({ type: 'text', nullable: true })
  justificationTransfert: string;

  // Documents
  @Column({ default: false })
  ordonnanceSortieGeneree: boolean;

  @Column({ default: false })
  instructionsPostOpGenerees: boolean;

  // Signature
  @Column({ nullable: true })
  signatureData: string;

  @Column({ nullable: true })
  signatureHorodatage: string;

  @Column({ nullable: true })
  statut: string; // EN_COURS | VALIDE | CLOTURE

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
