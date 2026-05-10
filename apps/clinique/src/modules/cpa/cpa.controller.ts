import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

@ApiTags('CPA')
@Controller('cpa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CpaController {
  constructor(private readonly cpaService: CpaService) {}

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une CPA' })
  @ApiResponse({ status: 200, description: 'CPA creee' })
  create(@Body() body: CreateCpaInput) {
    return this.cpaService.create(body);
  }

  @Patch(':id/realise')
  @Roles('ONM')
  @ApiOperation({ summary: 'Marquer la CPA comme REALISEE' })
  @ApiResponse({ status: 200, description: 'CPA mise a jour' })
  markRealise(@Param('id') id: string) {
    return this.cpaService.markAsRealise(id);
  }
}
