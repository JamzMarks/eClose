import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { SelfUserHttpGuard } from "@/infrastructure/http/guards/self-user.http.guard";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";
import { QuickSignupDto } from "./dto/quick-signup.dto";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";
import { UpdatePushTokensDto } from "./dto/update-push-tokens.dto";
import { IUserService } from "@/user/application/ports/user.service.interface";
import { USER_SERVICE } from "@/user/application/tokens/user.tokens";

@Controller("users")
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly usersService: IUserService) {}

  /** Cadastro rápido na própria app (confirmação in-app, sem redirecionar para outro produto) */
  @Post("quick-signup")
  quickSignup(@Body() dto: QuickSignupDto) {
    return this.usersService.quickSignup(dto);
  }

  @Get("me/linked-entities")
  @PrivateRoute()
  myLinkedEntities(@CurrentUser() user: JwtValidatedUser) {
    return this.usersService.listLinkedEntities(user.id);
  }

  @Get("me/notification-preferences")
  @PrivateRoute()
  getMyNotificationPreferences(@CurrentUser() user: JwtValidatedUser) {
    return this.usersService.getNotificationPreferences(user.id);
  }

  @Patch("me/notification-preferences")
  @PrivateRoute()
  patchMyNotificationPreferences(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.usersService.updateNotificationPreferences(user.id, dto);
  }

  @Get("me/push-tokens")
  @PrivateRoute()
  getMyPushTokens(@CurrentUser() user: JwtValidatedUser) {
    return this.usersService.getPushTokens(user.id);
  }

  @Patch("me/push-tokens")
  @PrivateRoute()
  patchMyPushTokens(@CurrentUser() user: JwtValidatedUser, @Body() dto: UpdatePushTokensDto) {
    return this.usersService.updatePushTokens(user.id, dto);
  }

  @Put("me/push-tokens")
  @PrivateRoute()
  putMyPushTokens(@CurrentUser() user: JwtValidatedUser, @Body() dto: UpdatePushTokensDto) {
    return this.usersService.updatePushTokens(user.id, dto);
  }

  @Get(":id")
  @PrivateRoute()
  @UseGuards(SelfUserHttpGuard)
  async findOne(@Param("id") id: string) {
    const u = await this.usersService.findById(id);
    if (!u) throw new NotFoundException("Utilizador não encontrado");
    return u;
  }
}
