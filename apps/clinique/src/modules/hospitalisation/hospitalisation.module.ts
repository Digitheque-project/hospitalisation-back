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
  SoinsEntity,
  TransfertEntity,
} from './hospitalisation.entities';
import { HospitalisationResolver } from './hospitalisation.resolver';
import { HospitalisationService } from './hospitalisation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalisationEntity,
      ObservationMedicalEntity,
      DiagnosticsEntity,
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
  providers: [HospitalisationService, HospitalisationResolver],
  exports: [HospitalisationService],
})
export class HospitalisationModule {}
