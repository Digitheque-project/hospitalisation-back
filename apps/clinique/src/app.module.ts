import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CpaModule } from './modules/cpa/cpa.module';
import { VpaModule } from './modules/vpa/vpa.module';
import { PatientModule } from './modules/patient/patient.module';
import { HospitalisationModule } from './modules/hospitalisation/hospitalisation.module';
import { AuthModule } from './modules/auth/auth.module';
import { SignatureModule } from './modules/signature/signature.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'sih'),
        password: configService.get<string>('DB_PASSWORD', 'sih'),
        database: configService.get<string>('DB_NAME', 'clinique'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const playgroundEnabled =
          configService.get<string>('GRAPHQL_PLAYGROUND_ENABLED', 'false') === 'true';
        return {
          autoSchemaFile: join(process.cwd(), 'apps/clinique/schema.gql'),
          playground: playgroundEnabled,
          introspection: playgroundEnabled,
          context: ({ req }: { req: unknown }) => ({ req }),
        };
      },
    }),
    CpaModule,
    VpaModule,
    PatientModule,
    HospitalisationModule,
    AuthModule,
    SignatureModule,
  ],
})
export class AppModule {}
