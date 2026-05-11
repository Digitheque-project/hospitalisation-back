import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignatureModule } from '../signature/signature.module';
import { HospitalisationController } from './hospitalisation.controller';
import {
  AffectationLitEntity,
  AffectationMedecinEntity,
  AvisMedicalEntity,
  ChambreEntity,
  DemandeAvisEntity,
  DemandeTransfertEntity,
  DiagnosticsEntity,
  HospitalisationEntity,
  LitEntity,
  ModeSortieEntity,
  ObservationMedicalEntity,
  PatientRefEntity,
  PersonnelRefEntity,
  PrescriptionMedicaleEntity,
  ServiceRefEntity,
  SoinsEntity,
  TransfertEntity,
} from './hospitalisation.entities';
import { HospitalisationResolver } from './hospitalisation.resolver';
import { HospitalisationService } from './hospitalisation.service';
import { HospitalisationGateway } from './hospitalisation.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalisationEntity,
      PatientRefEntity,
      ServiceRefEntity,
      PersonnelRefEntity,
      ObservationMedicalEntity,
      DiagnosticsEntity,
      PrescriptionMedicaleEntity,
      SoinsEntity,
      ChambreEntity,
      LitEntity,
      AffectationLitEntity,
      AffectationMedecinEntity,
      DemandeTransfertEntity,
      TransfertEntity,
      DemandeAvisEntity,
      AvisMedicalEntity,
      ModeSortieEntity,
    ]),
    SignatureModule,
  ],
  controllers: [HospitalisationController],
  providers: [HospitalisationService, HospitalisationResolver, HospitalisationGateway],
  exports: [HospitalisationService],
})
export class HospitalisationModule {}
