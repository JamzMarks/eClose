import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtValidatedUser => {
    const req = ctx.switchToHttp().getRequest<{ user: JwtValidatedUser }>();
    return req.user;
  },
);
