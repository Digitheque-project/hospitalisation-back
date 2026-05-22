import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HospitalisationEpisodeEntity, StatutHospitalisation } from '../../domain/entities/hospitalisation-episode.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  UpdateHospitalisationStatusDto,
} from './hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';

@Resolver(() => HospitalisationEpisodeEntity)
export class HospitalisationResolver {
  constructor(private readonly hospitalisationService: HospitalisationService) {}

  @Mutation(() => HospitalisationEpisodeEntity)
  createHospitalisationEpisode(@Args('input') input: CreateHospitalisationEpisodeDto) {
    return this.hospitalisationService.createEpisode(input);
  }

  @Mutation(() => HospitalisationEpisodeEntity)
  updateHospitalisationStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateHospitalisationStatusDto,
  ) {
    return this.hospitalisationService.updateStatus(id, input);
  }

  @Mutation(() => HospitalisationEpisodeEntity)
  closeHospitalisationEpisode(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CloseHospitalisationEpisodeDto,
  ) {
    return this.hospitalisationService.closeEpisode(id, input);
  }

  @Query(() => HospitalisationEpisodeEntity)
  hospitalisationEpisode(@Args('id', { type: () => ID }) id: string) {
    return this.hospitalisationService.findEpisodeById(id);
  }

  @Query(() => [HospitalisationEpisodeEntity])
  hospitalisationEpisodes(
    @Args('serviceId', { type: () => String }) serviceId: string,
    @Args('patientId', { type: () => String, nullable: true }) patientId?: string,
    @Args('statut', { type: () => StatutHospitalisation, nullable: true }) statut?: StatutHospitalisation,
  ) {
    return this.hospitalisationService.listEpisodes({ patientId, serviceId, statut });
  }
}
