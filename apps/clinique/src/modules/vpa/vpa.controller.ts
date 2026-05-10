import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateVpaInput } from './create-vpa.input';
import { VpaService } from './vpa.service';

@ApiTags('VPA')
@Controller('vpa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VpaController {
  constructor(private readonly vpaService: VpaService) {}

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une VPA' })
  @ApiResponse({ status: 200, description: 'VPA creee' })
  create(@Body() body: CreateVpaInput) {
    return this.vpaService.create(body);
  }

  @Patch(':id/validate')
  @Roles('ONM')
  @ApiOperation({ summary: 'Valider la VPA' })
  @ApiResponse({ status: 200, description: 'VPA validee' })
  validate(@Param('id') id: string) {
    return this.vpaService.validate(id);
  }
}
