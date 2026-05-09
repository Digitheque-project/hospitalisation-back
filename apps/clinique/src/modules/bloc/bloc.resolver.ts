import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlocOperatoireEntity } from './bloc.entity';
import { BlocService } from './bloc.service';
import { PlanifierBlocInput } from './planifier-bloc.input';

@Resolver(() => BlocOperatoireEntity)
export class BlocResolver {
  constructor(private readonly blocService: BlocService) {}

  @Mutation(() => BlocOperatoireEntity)
  planifierBloc(@Args('input') input: PlanifierBlocInput) {
    return this.blocService.planifier(input);
  }

  @Query(() => BlocOperatoireEntity, { nullable: true })
  latestBloc(@Args('patientId') patientId: string) {
    return this.blocService.findLatestByPatient(patientId);
  }
}
