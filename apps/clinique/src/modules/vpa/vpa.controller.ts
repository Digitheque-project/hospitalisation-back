import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateVpaInput } from './create-vpa.input';
import { VpaService } from './vpa.service';

@Controller('vpa')
@UseGuards(RolesGuard)
export class VpaController {
  constructor(private readonly vpaService: VpaService) {}

  @Post()
  @Roles('ONM')
  create(@Body() body: CreateVpaInput) {
    return this.vpaService.create(body);
  }

  @Patch(':id/validate')
  @Roles('ONM')
  validate(@Param('id') id: string) {
    return this.vpaService.validate(id);
  }
}
