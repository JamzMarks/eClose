import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuthAccountOrmEntity } from "@/auth/infrastructure/persistence/oauth-account.orm-entity";
import { RefreshTokenOrmEntity } from "@/auth/infrastructure/persistence/refresh-token.orm-entity";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AUTH_SERVICE, OAUTH_PROVIDER_GATEWAY } from "./tokens/auth.tokens";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { HttpOAuthProviderGateway } from "./infrastructure/http-oauth-provider.gateway";
import { JWT_ACCESS_EXPIRES, JWT_SECRET } from "./auth.constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, RefreshTokenOrmEntity, OAuthAccountOrmEntity]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRES as import("@nestjs/jwt").JwtSignOptions["expiresIn"] },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: OAUTH_PROVIDER_GATEWAY,
      useClass: HttpOAuthProviderGateway,
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE, JwtModule, PassportModule],
})
export class AuthModule {}
