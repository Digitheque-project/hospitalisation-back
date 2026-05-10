import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class DevTokenRequestDto {
  @ApiProperty({ type: String, description: 'Identifiant utilisateur', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ type: String, description: 'Profil utilisateur', required: false })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiProperty({ type: String, description: "Numero d'ordre professionnel", required: false })
  @IsOptional()
  @IsString()
  orderNumber?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('dev-token')
  @ApiOperation({ summary: 'Generer un JWT de developpement' })
  @ApiResponse({ status: 201, description: 'Token de test genere' })
  generateDevToken(@Body() body: DevTokenRequestDto) {
    const payload = {
      sub: body.userId ?? 'dev-user',
      profile: body.profile ?? 'ONM',
      orderNumber: body.orderNumber ?? 'ONM-12345',
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'dev-secret',
    });

    return {
      accessToken: token,
      tokenType: 'Bearer',
      payload,
    };
  }
}
