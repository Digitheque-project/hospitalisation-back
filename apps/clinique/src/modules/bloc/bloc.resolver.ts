import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BlocOperatoireEntity } from './bloc.entity';
import { BlocService } from './bloc.service';
import { PlanifierBlocInput } from './planifier-bloc.input';

@Resolver(() => BlocOperatoireEntity)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlocResolver {
  constructor(private readonly blocService: BlocService) {}

  @Mutation(() => BlocOperatoireEntity)
  @Roles('ONM')
  planifierBloc(@Args('input') input: PlanifierBlocInput) {
    return this.blocService.planifier(input);
  }

  @Query(() => BlocOperatoireEntity, { nullable: true })
  @Roles('ONM', 'ONIM')
  latestBloc(@Args('patientId') patientId: string) {
    return this.blocService.findLatestByPatient(patientId);
  }
}
