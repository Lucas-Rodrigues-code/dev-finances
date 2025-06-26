import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/db';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_AUTH_SERVER_URL', 'http://localhost:8080'),
        realm: configService.get<string>('KEYCLOAK_REALM', 'dev-finances'),
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID', 'client_id_finances'),
        secret: configService.get<string>('KEYCLOAK_CLIENT_SECRET', ''),
        cookieKey: configService.get<string>('KEYCLOAK_COOKIE_KEY', 'KEYCLOAK_JWT'),
        logLevels: configService.get<string>('NODE_ENV') === 'development' ? ['verbose'] : ['error'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
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
