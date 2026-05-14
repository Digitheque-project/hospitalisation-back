import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ObservationService } from './observation.service';
import { UpsertObservationDto } from './dto/upsert-observation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Observations')
@Controller('patients/:patientId/observation')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Get()
  get(@Param('patientId') patientId: string) {
    return this.observationService.getByPatient(patientId);
  }

  @Put()
  upsert(
    @Param('patientId') patientId: string,
    @Body() dto: UpsertObservationDto,
  ) {
    return this.observationService.upsert(patientId, dto);
  }
}
