import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AvisEntity } from '../../domain/entities/avis.entity';
import { CreateAvisDto, UpdateAvisDto } from './avis.dto';
import { AvisService } from './avis.service';

@Resolver(() => AvisEntity)
export class AvisResolver {
  constructor(private readonly avisService: AvisService) {}

  @Mutation(() => AvisEntity)
  async createAvis(@Args('input') input: CreateAvisDto): Promise<AvisEntity> {
    return this.avisService.create(input);
  }

  @Query(() => AvisEntity, { nullable: true })
  async avis(
    @Args('id') id: string,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<AvisEntity> {
    return this.avisService.findById(id, chuId);
  }

  @Query(() => [AvisEntity])
  async avisList(
    @Args('chuId', { nullable: true }) chuId?: string,
    @Args('serviceIdSource', { nullable: true }) serviceIdSource?: string,
    @Args('serviceIdDest', { nullable: true }) serviceIdDest?: string,
    @Args('patientId', { nullable: true }) patientId?: string,
    @Args('statut', { nullable: true }) statut?: string,
  ): Promise<AvisEntity[]> {
    return this.avisService.findAll({ chuId, serviceIdSource, serviceIdDest, patientId, statut: statut as any });
  }

  @Mutation(() => AvisEntity)
  async updateAvis(
    @Args('id') id: string,
    @Args('input') input: UpdateAvisDto,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<AvisEntity> {
    return this.avisService.update(id, input, chuId);
  }

  @Mutation(() => Boolean)
  async deleteAvis(
    @Args('id') id: string,
    @Args('chuId', { nullable: true }) chuId?: string,
  ): Promise<boolean> {
    await this.avisService.delete(id, chuId);
    return true;
  }
}
