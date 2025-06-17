import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/db';
import { ConfigModule } from '@nestjs/config';
//modules
import { UserModule } from './modules/users/user.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BalanceModule } from './modules/balance/balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    TransactionModule,
    CategoriesModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
