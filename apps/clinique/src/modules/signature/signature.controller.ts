import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SignatureService } from './signature.service';

class SignatureDto {
  @ApiProperty({ type: String, description: 'Acte a signer', required: true })
  @IsString()
  acte: string;

  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  patientId: string;

  @ApiProperty({
    type: String,
    description: "Numero d'Ordre professionnel du signataire",
    required: true,
  })
  @IsString()
  signerId: string;
}

@ApiTags('Signature')
@ApiBearerAuth()
@Controller('signatures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post()
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Signer un acte critique' })
  @ApiResponse({ status: 201, description: 'Acte signe' })
  signer(@Body() body: SignatureDto) {
    this.signatureService.assertProfessionalOrderNumber({
      orderNumber: body.signerId,
    });
    return {
      status: 'SIGNE',
      timestamp: new Date().toISOString(),
      payload: body,
    };
  }
}
