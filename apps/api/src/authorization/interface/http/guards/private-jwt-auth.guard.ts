import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PRIVATE_ROUTE_KEY } from "@/infrastructure/http/metadata/private-route.metadata";

/**
 * Por omissão as rotas são públicas. Com @PrivateRoute() exige JWT válido.
 */
@Injectable()
export class PrivateJwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPrivate = this.reflector.getAllAndOverride<boolean>(IS_PRIVATE_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPrivate) {
      return true;
    }
    return super.canActivate(context);
  }
}
