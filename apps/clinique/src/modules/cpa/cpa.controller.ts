import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

@Controller('cpa')
@UseGuards(RolesGuard)
export class CpaController {
  constructor(private readonly cpaService: CpaService) {}

  @Post()
  @Roles('ONM')
  create(@Body() body: CreateCpaInput) {
    return this.cpaService.create(body);
  }

  @Patch(':id/realise')
  @Roles('ONM')
  markRealise(@Param('id') id: string) {
    return this.cpaService.markAsRealise(id);
  }
}
