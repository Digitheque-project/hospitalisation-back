import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  AvisMedicalEntity,
  AffectationLitEntity,
  DemandeAvisEntity,
  DemandeTransfertEntity,
  DiagnosticsEntity,
  HospitalisationEntity,
  PrescriptionMedicaleEntity,
} from './hospitalisation.entities';
import { HospitalisationService } from './hospitalisation.service';
import {
  CloturerHospitalisationDto,
  CreateAffectationLitDto,
  CreateAvisMedicalDto,
  CreateDemandeAvisDto,
  CreateDemandeTransfertDto,
  CreateDiagnosticsDto,
  CreateHospitalisationDto,
  CreatePrescriptionMedicaleDto,
  TraiterDemandeTransfertDto,
} from './hospitalisation.dto';

@Resolver(() => HospitalisationEntity)
@UseGuards(JwtAuthGuard, RolesGuard)
export class HospitalisationResolver {
  constructor(private readonly hospitalisationService: HospitalisationService) {}

  @Mutation(() => HospitalisationEntity)
  @Roles('ONM')
  createHospitalisation(@Args('input') input: CreateHospitalisationDto) {
    return this.hospitalisationService.createHospitalisation(input);
  }

  @Mutation(() => AffectationLitEntity)
  @Roles('ONM', 'ONIM')
  createAffectationLit(@Args('input') input: CreateAffectationLitDto) {
    return this.hospitalisationService.createAffectationLit(input);
  }

  @Query(() => HospitalisationEntity, { nullable: true })
  @Roles('ONM', 'ONIM')
  hospitalisation(@Args('id', { type: () => ID }) id: string) {
    return this.hospitalisationService.findHospitalisationById(id);
  }

  @Mutation(() => DemandeAvisEntity)
  @Roles('ONM')
  createDemandeAvis(@Args('input') input: CreateDemandeAvisDto) {
    return this.hospitalisationService.createDemandeAvis(input);
  }

  @Mutation(() => DemandeAvisEntity)
  @Roles('ONM', 'ONIM')
  consulterDemandeAvis(@Args('id', { type: () => ID }) id: string) {
    return this.hospitalisationService.consulterDemandeAvis(id);
  }

  @Mutation(() => DiagnosticsEntity)
  @Roles('ONM')
  createDiagnostic(
    @Args('input') input: CreateDiagnosticsDto,
    @Context() context: { req?: { user?: { orderNumber?: string } } },
  ) {
    return this.hospitalisationService.createDiagnostics(input, context?.req?.user ?? null);
  }

  @Mutation(() => AvisMedicalEntity)
  @Roles('ONM')
  createAvisMedical(
    @Args('input') input: CreateAvisMedicalDto,
    @Context() context: { req?: { user?: { orderNumber?: string } } },
  ) {
    return this.hospitalisationService.createAvisMedical(input, context?.req?.user ?? null);
  }

  @Mutation(() => PrescriptionMedicaleEntity)
  @Roles('ONM')
  createPrescriptionMedicale(
    @Args('input') input: CreatePrescriptionMedicaleDto,
    @Context() context: { req?: { user?: { orderNumber?: string } } },
  ) {
    return this.hospitalisationService.createPrescriptionMedicale(input, context?.req?.user ?? null);
  }

  @Mutation(() => DemandeTransfertEntity)
  @Roles('ONM')
  createDemandeTransfert(@Args('input') input: CreateDemandeTransfertDto) {
    return this.hospitalisationService.createDemandeTransfert(input);
  }

  @Mutation(() => DemandeTransfertEntity)
  @Roles('ONM')
  traiterDemandeTransfert(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: TraiterDemandeTransfertDto,
  ) {
    return this.hospitalisationService.traiterDemandeTransfert(id, input);
  }

  @Mutation(() => HospitalisationEntity)
  @Roles('ONM')
  cloturerHospitalisation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CloturerHospitalisationDto,
  ) {
    return this.hospitalisationService.cloturerHospitalisation(id, input);
  }
}
