import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

@Resolver(() => CpaEntity)
export class CpaResolver {
  constructor(private readonly cpaService: CpaService) {}

  @Mutation(() => CpaEntity)
  createCpa(@Args('input') input: CreateCpaInput) {
    return this.cpaService.create(input);
  }

  @Query(() => CpaEntity, { nullable: true })
  latestCpa(@Args('patientId') patientId: string) {
    return this.cpaService.findLatestByPatient(patientId);
  }
}
