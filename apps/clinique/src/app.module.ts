import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ChambreModule } from './modules/chambre/chambre.module';
import { HospitalisationModule } from './modules/hospitalisation/hospitalisation.module';
import { LitModule } from './modules/lit/lit.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV', 'development') === 'production';
        const syncDefault = isProduction ? 'false' : 'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'sih'),
          password: configService.get<string>('DB_PASSWORD', 'sih'),
          database: configService.get<string>('DB_NAME', 'clinique'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('DB_SYNC', syncDefault) === 'true',
        };
      },
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
    HospitalisationModule,
    ChambreModule,
    LitModule,
  ],
})
export class AppModule {}
