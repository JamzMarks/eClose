// auth/auth.module.ts

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AUTH_SERVICE } from "./tokens/auth.tokens";

@Module({
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService
    }
  ],
  exports: [AUTH_SERVICE]
})
export class AuthModule {}