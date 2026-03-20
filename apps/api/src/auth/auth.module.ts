// auth/auth.module.ts

import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./tokens/auth.tokens";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService
    }
  ],
  exports: [AUTH_SERVICE]
})
export class AuthModule {}