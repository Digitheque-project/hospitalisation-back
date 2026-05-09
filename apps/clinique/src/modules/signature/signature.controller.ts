import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

class SignatureDto {
  @IsString()
  acte: string;

  @IsString()
  patientId: string;

  @IsString()
  signerId: string;
}

@Controller('signatures')
@UseGuards(RolesGuard)
export class SignatureController {
  @Post()
  @Roles('ONM', 'ONIM')
  signer(@Body() body: SignatureDto) {
    return {
      status: 'SIGNE',
      timestamp: new Date().toISOString(),
      payload: body,
    };
  }
}
