import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DemandeEntity } from '../../domain/entities/demande.entity';
import { CreateDemandeDto, UpdateDemandeDto } from './demande.dto';
import { DemandeService } from './demande.service';

@Resolver(() => DemandeEntity)
export class DemandeResolver {
  constructor(private readonly demandeService: DemandeService) {}

  @Mutation(() => DemandeEntity)
  async createDemande(@Args('input') input: CreateDemandeDto): Promise<DemandeEntity> {
    return this.demandeService.create(input);
  }

  @Query(() => DemandeEntity, { nullable: true })
  async demande(
    @Args('id') id: string,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<DemandeEntity> {
    return this.demandeService.findById(id, chuId);
  }

  @Query(() => [DemandeEntity])
  async demandes(
    @Args('chuId', { nullable: true }) chuId?: string,
    @Args('serviceId', { nullable: true }) serviceId?: string,
    @Args('patientId', { nullable: true }) patientId?: string,
    @Args('statut', { nullable: true }) statut?: string,
  ): Promise<DemandeEntity[]> {
    return this.demandeService.findAll({ chuId, serviceId, patientId, statut: statut as any });
  }

  @Mutation(() => DemandeEntity)
  async updateDemande(
    @Args('id') id: string,
    @Args('input') input: UpdateDemandeDto,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<DemandeEntity> {
    return this.demandeService.update(id, input, chuId);
  }

  @Mutation(() => Boolean)
  async deleteDemande(
    @Args('id') id: string,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<boolean> {
    await this.demandeService.delete(id, chuId);
    return true;
  }
}
