import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'lucas',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'dev_finances',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // apenas em desenvolvimento
  logging: process.env.NODE_ENV === 'development',
};