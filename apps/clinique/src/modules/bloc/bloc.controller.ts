import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BlocService } from './bloc.service';
import { PlanifierBlocInput } from './planifier-bloc.input';

@ApiTags('Bloc')
@Controller('bloc')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlocController {
  constructor(private readonly blocService: BlocService) {}

  @Post('planifier')
  @Roles('ONM')
  @ApiOperation({ summary: 'Planifier un passage au bloc' })
  @ApiResponse({ status: 200, description: 'Planification bloc creee' })
  planifier(@Body() body: PlanifierBlocInput) {
    return this.blocService.planifier(body);
  }
}
