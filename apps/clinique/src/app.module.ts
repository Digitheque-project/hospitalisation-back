import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
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
        const syncEnabled =
          configService.get<string>('DB_SYNC', syncDefault) === 'true' && !isProduction;

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: syncEnabled,
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
          autoSchemaFile: true,
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
