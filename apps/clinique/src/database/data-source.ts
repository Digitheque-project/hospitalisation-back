import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ChambreEntity } from '../domain/entities/chambre.entity';
import { HospitalisationEpisodeEntity } from '../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../domain/entities/lit.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'sih',
  password: process.env.DB_PASSWORD ?? 'sih',
  database: process.env.DB_NAME ?? 'clinique',
  entities: [HospitalisationEpisodeEntity, ChambreEntity, LitEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
