// Doit rester le tout premier import : plusieurs modules (ex: config/*-api.config.ts)
// lisent process.env.* au chargement du module (constante top-level), pas via
// ConfigService — sans ce chargement anticipe, ils capturent des valeurs vides
// avant que quoi que ce soit d'autre n'ait eu la chance de peupler process.env
// depuis le .env local. En prod (Render), les variables sont deja injectees
// dans process.env et cet appel est un no-op sans effet.
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('clinique');

  const corsOrigins = (process.env.SECURITY_CORS_ORIGINS ?? '*')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hospitalisation Episodes API')
    .setDescription('Microservice de gestion des episodes d hospitalisation')
    .setVersion('1.0.0')
    // Ajoute le bouton "Authorize" dans Swagger pour coller un token JWT.
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // Applique le token a TOUS les endpoints une fois "Authorize" renseigne.
  swaggerDocument.security = [{ 'access-token': [] }];
  SwaggerModule.setup('clinique/api/docs', app, swaggerDocument);

  // Render injecte PORT; on garde CLINIQUE_PORT pour le local et les conteneurs.
  const port = Number(process.env.PORT ?? process.env.CLINIQUE_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
