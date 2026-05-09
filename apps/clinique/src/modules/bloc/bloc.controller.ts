import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BlocService } from './bloc.service';
import { PlanifierBlocInput } from './planifier-bloc.input';

@Controller('bloc')
@UseGuards(RolesGuard)
export class BlocController {
  constructor(private readonly blocService: BlocService) {}

  @Post('planifier')
  @Roles('ONM')
  planifier(@Body() body: PlanifierBlocInput) {
    return this.blocService.planifier(body);
  }
}
