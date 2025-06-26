import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/entities/user.entity';

export interface TokenInfo {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface UserProfile {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
}

@Injectable()
export class AuthService {
  private readonly keycloakBaseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.keycloakBaseUrl = this.configService.get<string>(
      'KEYCLOAK_AUTH_SERVER_URL',
      'http://localhost:8080',
    );
    this.realm = this.configService.get<string>(
      'KEYCLOAK_REALM',
      'dev-finances',
    );
    this.clientId = this.configService.get<string>(
      'KEYCLOAK_CLIENT_ID',
      'client_id_finances',
    );
    this.clientSecret = this.configService.get<string>(
      'KEYCLOAK_CLIENT_SECRET',
      '',
    );
  }

  /**
   * Realiza login com credenciais do usuário
   */
  async login(username: string, password: string): Promise<TokenInfo> {
    const url = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username,
      password,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new UnauthorizedException(
          error.error_description || 'Credenciais inválidas',
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        'Erro ao conectar com o servidor de autenticação',
      );
    }
  }

  /**
   * Renova o token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenInfo> {
    const url = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erro ao renovar token');
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(refreshToken: string): Promise<void> {
    const url = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/logout`;

    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        console.warn('Erro ao fazer logout no Keycloak, mas continuando...');
      }
    } catch (error) {
      console.warn('Erro ao conectar com Keycloak para logout:', error.message);
    }
  }

  /**
   * Obtém informações do perfil do usuário a partir do token
   */
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const url = `${this.keycloakBaseUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erro ao obter informações do usuário');
    }
  }

  /**
   * Valida se o token está válido
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.getUserProfile(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sincroniza usuário do Keycloak com o banco local
   */
  async syncUserFromKeycloak(userProfile: UserProfile): Promise<User> {
    try {
      // Tenta encontrar usuário existente
      let user = await this.userService.findByEmail(userProfile.email);
      return user;
    } catch {
      // Se não encontrar, cria novo usuário
      const newUser = {
        email: userProfile.email,
        name: userProfile.name || userProfile.preferred_username,
        password: '', // Senha gerenciada pelo Keycloak
      };

      return await this.userService.create(newUser);
    }
  }
}
