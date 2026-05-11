import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccueilApiModule } from '../accueil/accueil-api.module';
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
    AccueilApiModule,
    TypeOrmModule.forFeature([
      HospitalisationEntity,
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
