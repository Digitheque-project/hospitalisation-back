import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

@Resolver(() => CpaEntity)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CpaResolver {
  constructor(private readonly cpaService: CpaService) {}

  @Mutation(() => CpaEntity)
  @Roles('ONM')
  createCpa(@Args('input') input: CreateCpaInput) {
    return this.cpaService.create(input);
  }

  @Query(() => CpaEntity, { nullable: true })
  @Roles('ONM', 'ONIM')
  latestCpa(@Args('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string) {
    return this.cpaService.findLatestByPatient(patientId);
  }
}
