import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatutHospitalisation {
  EN_COURS = 'EN_COURS',
  CLOTUREE = 'CLOTUREE',
}

export enum StatutLit {
  DISPONIBLE = 'DISPONIBLE',
  OCCUPE = 'OCCUPE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum StatutDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  CONSULTEE = 'CONSULTEE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

export enum StatutDemandeTransfert {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

registerEnumType(StatutHospitalisation, { name: 'StatutHospitalisation' });
registerEnumType(StatutLit, { name: 'StatutLit' });
registerEnumType(StatutDemande, { name: 'StatutDemande' });
registerEnumType(StatutDemandeTransfert, { name: 'StatutDemandeTransfert' });

@ObjectType()
@Entity('service_ref')
export class ServiceRefEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: 'id_service', type: 'varchar', length: 120 })
  id: string;
}


@ObjectType()
@Entity('personnel_ref')
export class PersonnelRefEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: 'id_personnel', type: 'varchar', length: 120 })
  id: string;
}

@ObjectType()
@Entity('mode_sortie')
export class ModeSortieEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_mode_sortie' })
  id: string;

  @Field()
  @Column({ name: 'nom_mode_sortie', type: 'varchar', length: 120 })
  nomModeSortie: string;

  @OneToMany(() => HospitalisationEntity, (hospitalisation) => hospitalisation.modeSortie)
  hospitalisations: HospitalisationEntity[];
}

@ObjectType()
@Entity('hospitalisation')
export class HospitalisationEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_hospitalisation' })
  id: string;

  @Field()
  @Column({ name: 'id_patient', type: 'varchar', length: 120 })
  patientId: string;

  @Field()
  @Column({ name: 'id_service', type: 'varchar', length: 120 })
  serviceId: string;

  @ManyToOne(() => ServiceRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_service', referencedColumnName: 'id' })
  service: ServiceRefEntity;

  @Field(() => Date)
  @Column({ name: 'date_entrer', type: 'timestamp' })
  dateEntrer: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_sortie', type: 'timestamp', nullable: true })
  dateSortie?: Date | null;

  @Field()
  @Column({ name: 'motif_hospitalisation', type: 'text' })
  motifHospitalisation: string;

  @Field()
  @Column({ name: 'type_hospitalisation', type: 'varchar', length: 40, default: 'Hospitalisation' })
  type: string;

  @Field(() => StatutHospitalisation)
  @Column({ name: 'statut_hospitalisation', type: 'varchar', default: StatutHospitalisation.EN_COURS })
  statutHospitalisation: StatutHospitalisation;

  @Field(() => StatutDemande)
  @Column({ name: 'status_demande', type: 'varchar', default: StatutDemande.EN_ATTENTE })
  statusDemande: StatutDemande;

  @Field(() => String, { nullable: true })
  @Column({ name: 'commentaire', type: 'text', nullable: true })
  commentaire?: string | null;

  @Field(() => ModeSortieEntity, { nullable: true })
  @ManyToOne(() => ModeSortieEntity, (modeSortie) => modeSortie.hospitalisations, { nullable: true })
  @JoinColumn({ name: 'id_mode_sortie' })
  modeSortie?: ModeSortieEntity | null;

  @Column({ name: 'id_mode_sortie', type: 'uuid', nullable: true })
  idModeSortie?: string | null;
}

@ObjectType()
@Entity('prescription_medicale')
export class PrescriptionMedicaleEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_prescription' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'id_medecin', type: 'varchar', length: 120 })
  idMedecin: string;

  @Field()
  @Column({ name: 'contenu_prescription', type: 'text' })
  contenuPrescription: string;

  @Field(() => Date)
  @Column({ name: 'date_prescription', type: 'timestamp' })
  datePrescription: Date;
}

@ObjectType()
@Entity('observation_medical')
export class ObservationMedicalEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_observation' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @Field()
  @Column({ name: 'id_personnel', type: 'varchar', length: 120 })
  idPersonnel: string;

  @ManyToOne(() => PersonnelRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_personnel', referencedColumnName: 'id' })
  personnel: PersonnelRefEntity;

  @Field(() => Date)
  @Column({ name: 'date_observation', type: 'timestamp' })
  dateObservation: Date;

  @Field()
  @Column({ name: 'contenu_observation', type: 'text' })
  contenuObservation: string;
}

@ObjectType()
@Entity('diagnostics')
export class DiagnosticsEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_diagnostic' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'id_personnel', type: 'varchar', length: 120 })
  idPersonnel: string;

  @ManyToOne(() => PersonnelRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_personnel', referencedColumnName: 'id' })
  personnel: PersonnelRefEntity;

  @Field(() => Date)
  @Column({ name: 'date_diagnostics', type: 'timestamp' })
  dateDiagnostics: Date;

  @Field()
  @Column({ name: 'description_diagnostic', type: 'text' })
  descriptionDiagnostic: string;
}

@ObjectType()
@Entity('soins')
export class SoinsEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_soins' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'id_personnel', type: 'varchar', length: 120 })
  idPersonnel: string;

  @ManyToOne(() => PersonnelRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_personnel', referencedColumnName: 'id' })
  personnel: PersonnelRefEntity;

  @Field()
  @Column({ name: 'type_soins', type: 'varchar', length: 120 })
  typeSoins: string;

  @Field(() => Date)
  @Column({ name: 'date_soins', type: 'timestamp' })
  dateSoins: Date;

  @Field(() => String, { nullable: true })
  @Column({ name: 'observations_soins', type: 'text', nullable: true })
  observationsSoins?: string | null;
}

@ObjectType()
@Entity('chambre')
export class ChambreEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_chambre' })
  id: string;

  @Field()
  @Column({ name: 'id_service', type: 'varchar', length: 120 })
  serviceId: string;

  @ManyToOne(() => ServiceRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_service', referencedColumnName: 'id' })
  service: ServiceRefEntity;

  @Field(() => Int)
  @Column({ name: 'numero_chambre', type: 'int' })
  numeroChambre: number;

  @Field()
  @Column({ name: 'type', type: 'varchar', length: 120 })
  type: string;
}

@ObjectType()
@Entity('lit')
export class LitEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_lit' })
  id: string;

  @Column({ name: 'id_chambre', type: 'uuid' })
  idChambre: string;

  @Field(() => ChambreEntity)
  @ManyToOne(() => ChambreEntity, { nullable: false })
  @JoinColumn({ name: 'id_chambre' })
  chambre: ChambreEntity;

  @Field()
  @Column({ name: 'code_lit', type: 'varchar', length: 120 })
  codeLit: string;

  @Field(() => StatutLit)
  @Column({ name: 'statut', type: 'varchar', default: StatutLit.DISPONIBLE })
  statut: StatutLit;
}

@ObjectType()
@Entity('affectation_lit')
export class AffectationLitEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_affectation' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @Field(() => HospitalisationEntity)
  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Column({ name: 'id_lit', type: 'uuid' })
  idLit: string;

  @Field(() => LitEntity)
  @ManyToOne(() => LitEntity, { nullable: false })
  @JoinColumn({ name: 'id_lit' })
  lit: LitEntity;

  @Field(() => Date)
  @Column({ name: 'date_debut_affectation', type: 'timestamp' })
  dateDebutAffectation: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_fin_affectation', type: 'timestamp', nullable: true })
  dateFinAffectation?: Date | null;
}

@ObjectType()
@Entity('affectation_medecin')
export class AffectationMedecinEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_affectation' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @Field(() => HospitalisationEntity)
  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'id_personnel', type: 'varchar', length: 120 })
  idPersonnel: string;

  @Field(() => PersonnelRefEntity)
  @ManyToOne(() => PersonnelRefEntity, { nullable: false })
  @JoinColumn({ name: 'id_personnel', referencedColumnName: 'id' })
  personnel: PersonnelRefEntity;

  @Field(() => Date)
  @Column({ name: 'date_debut', type: 'timestamp' })
  dateDebut: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_fin', type: 'timestamp', nullable: true })
  dateFin?: Date | null;

  @Field()
  @Column({ name: 'role', type: 'varchar', length: 120 })
  role: string;
}

@ObjectType()
@Entity('demande_transfert')
export class DemandeTransfertEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_demande_transfert' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @Field(() => HospitalisationEntity)
  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'service_source', type: 'varchar', length: 120 })
  serviceSource: string;

  @Field()
  @Column({ name: 'service_destination', type: 'varchar', length: 120 })
  serviceDestination: string;

  @Field(() => Date)
  @Column({ name: 'date_demande', type: 'timestamp' })
  dateDemande: Date;

  @Field()
  @Column({ name: 'motif_demande_transfert', type: 'text' })
  motifDemandeTransfert: string;

  @Field(() => StatutDemandeTransfert)
  @Column({ name: 'statut', type: 'varchar', default: StatutDemandeTransfert.EN_ATTENTE })
  statut: StatutDemandeTransfert;

  @Field(() => String, { nullable: true })
  @Column({ name: 'justification', type: 'text', nullable: true })
  justification?: string | null;
}

@ObjectType()
@Entity('transfert')
export class TransfertEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_transfert' })
  id: string;

  @Field(() => DemandeTransfertEntity)
  @ManyToOne(() => DemandeTransfertEntity, { nullable: false })
  @JoinColumn({ name: 'id_demande' })
  demande: DemandeTransfertEntity;

  @Column({ name: 'id_demande', type: 'uuid' })
  idDemande: string;

  @Field(() => Date)
  @Column({ name: 'date_transfert', type: 'timestamp' })
  dateTransfert: Date;
}

@ObjectType()
@Entity('demande_avis')
export class DemandeAvisEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_demande' })
  id: string;

  @Column({ name: 'id_hospitalisation', type: 'uuid' })
  idHospitalisation: string;

  @Field(() => HospitalisationEntity)
  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'id_hospitalisation' })
  hospitalisation: HospitalisationEntity;

  @Field()
  @Column({ name: 'id_medecin_demandeur', type: 'varchar', length: 120 })
  idMedecinDemandeur: string;

  @Field()
  @Column({ name: 'id_service_cible', type: 'varchar', length: 120 })
  idServiceCible: string;

  @Field()
  @Column({ name: 'motif', type: 'text' })
  motif: string;

  @Field(() => Date)
  @Column({ name: 'date_demande', type: 'timestamp' })
  dateDemande: Date;

  @Field(() => StatutDemande)
  @Column({ name: 'statut', type: 'varchar', default: StatutDemande.EN_ATTENTE })
  statut: StatutDemande;
}

@ObjectType()
@Entity('avis_medical')
export class AvisMedicalEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_avis' })
  id: string;

  @Field(() => DemandeAvisEntity)
  @ManyToOne(() => DemandeAvisEntity, { nullable: false })
  @JoinColumn({ name: 'id_demande' })
  demande: DemandeAvisEntity;

  @Column({ name: 'id_demande', type: 'uuid' })
  idDemande: string;

  @Field()
  @Column({ name: 'id_medecin', type: 'varchar', length: 120 })
  idMedecin: string;

  @Field(() => Date)
  @Column({ name: 'date_avis', type: 'timestamp' })
  dateAvis: Date;

  @Field()
  @Column({ name: 'conclusion', type: 'text' })
  conclusion: string;

  @Field()
  @Column({ name: 'recomandation', type: 'text' })
  recomandation: string;
}
