import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/db';
import { ConfigModule } from '@nestjs/config';

import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
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
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080', 
      realm: 'meu-app-realm', 
      clientId: 'nestjs-app', 
      secret: 'SEU_CLIENT_SECRET', 
      cookieKey: 'KEYCLOAK_JWT', 
      logLevels: ['verbose'], 
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    TransactionModule,
    CategoriesModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Protege rotas exigindo autenticação
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard, // Protege rotas baseadas em permissões de recursos
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard, // Protege rotas baseadas em roles (papéis)
    },
  ],
})
export class AppModule {}
