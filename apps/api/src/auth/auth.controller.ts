import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from "@nestjs/common";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { OAuthStartDto } from "./dto/oauth-start.dto";
import { OAuthCallbackDto } from "./dto/oauth-callback.dto";
import { AUTH_SERVICE } from "./tokens/auth.tokens";
import { IAuthService } from "./interfaces/auth.interface";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import type { Request } from "express";
import type { JwtValidatedUser } from "./strategies/jwt.strategy";

type AuthedRequest = Request & { user: JwtValidatedUser };

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post("sign-up")
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post("sign-in")
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post("logout")
  @PrivateRoute()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: AuthedRequest) {
    await this.authService.logout(req.user.id);
  }

  @Get("me")
  @PrivateRoute()
  getMe(@Req() req: AuthedRequest) {
    return this.authService.me(req.user.id);
  }

  @Post("oauth/start")
  oauthStart(@Body() dto: OAuthStartDto) {
    return this.authService.startOAuthLogin(dto);
  }

  @Post("oauth/callback")
  oauthCallback(@Body() dto: OAuthCallbackDto) {
    return this.authService.completeOAuthLogin(dto);
  }
}
