import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { Public, AuthenticatedUser } from 'nest-keycloak-connect';
import { AuthService, TokenInfo, UserProfile } from '../services/auth.service';
import { LoginDto, RefreshTokenDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenInfo> {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenInfo> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }

  @Post('validate-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  async validateToken(
    @Headers('authorization') authorization: string,
  ): Promise<{ valid: boolean }> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return { valid: false };
    }

    const accessToken = authorization.substring(7);
    const isValid = await this.authService.validateToken(accessToken);
    return { valid: isValid };
  }



  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@AuthenticatedUser() user: any) {
    const userProfile: UserProfile = {
      sub: user.sub,
      email_verified: user.email_verified || false,
      name: user.name,
      preferred_username: user.preferred_username,
      given_name: user.given_name,
      family_name: user.family_name,
      email: user.email,
      realm_access: user.realm_access || { roles: [] },
      resource_access: user.resource_access || {},
    };

    const localUser = await this.authService.syncUserFromKeycloak(userProfile);

    return {
      keycloak: userProfile,
      local: localUser,
    };
  }
}
