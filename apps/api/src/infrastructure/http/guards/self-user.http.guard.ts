import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";

/** Garante que `params.id` é o utilizador autenticado (dados pessoais / LGPD). */
@Injectable()
export class SelfUserHttpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      params: { id: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    if (req.params.id !== userId) {
      throw new ForbiddenException("Acesso apenas ao próprio perfil");
    }
    return true;
  }
}
