import { Inject, Controller, Body, Post, Get, Req } from "@nestjs/common";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { AUTH_SERVICE } from "./tokens/auth.tokens";
import { IAuthService } from "./interfaces/iauth.service";

@Controller("auth")
export class AuthController {

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService
  ) {}
  
  @Get("me")
  getMe(@Req() req) {
    return this.authService.me(req.user.id);
  }

  @Post()
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post()
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Get()
  refresh(@Body() dto: SignUpDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get()
  logout(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

}