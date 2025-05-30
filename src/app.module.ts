import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/users/user.module';
import { databaseConfig } from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
