import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVpaInput } from './create-vpa.input';
import { VpaEntity } from './vpa.entity';
import { VpaService } from './vpa.service';

@Resolver(() => VpaEntity)
export class VpaResolver {
  constructor(private readonly vpaService: VpaService) {}

  @Mutation(() => VpaEntity)
  createVpa(@Args('input') input: CreateVpaInput) {
    return this.vpaService.create(input);
  }

  @Query(() => VpaEntity, { nullable: true })
  latestVpa(@Args('patientId') patientId: string) {
    return this.vpaService.findLatestByPatient(patientId);
  }
}
