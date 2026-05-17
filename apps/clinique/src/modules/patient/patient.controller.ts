import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get(':patientId')
  @ApiOperation({ summary: 'Recuperer un patient par son identifiant' })
  @ApiParam({ name: 'patientId', description: 'Identifiant unique du patient' })
  @ApiResponse({ status: 200, description: 'Patient trouve' })
  @ApiResponse({ status: 404, description: 'Patient introuvable' })
  async getPatient(@Param('patientId') patientId: string) {
    const patient = await this.patientService.getPatientFull(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient avec l'ID ${patientId} introuvable`);
    }
    return patient;
  }
}
