import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateVpaInput } from './create-vpa.input';
import { VpaEntity } from './vpa.entity';
import { VpaService } from './vpa.service';

@Resolver(() => VpaEntity)
@UseGuards(JwtAuthGuard, RolesGuard)
export class VpaResolver {
  constructor(private readonly vpaService: VpaService) {}

  @Mutation(() => VpaEntity)
  @Roles('ONM')
  createVpa(@Args('input') input: CreateVpaInput) {
    return this.vpaService.create(input);
  }

  @Query(() => VpaEntity, { nullable: true })
  @Roles('ONM', 'ONIM')
  latestVpa(@Args('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string) {
    return this.vpaService.findLatestByPatient(patientId);
  }
}
