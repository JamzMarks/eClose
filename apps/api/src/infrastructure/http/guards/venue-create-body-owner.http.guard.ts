import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import type { VenueAccessPolicyPort } from "@/venue/application/ports/venue-access.policy.port";
import { VENUE_ACCESS_POLICY } from "@/venue/application/ports/venue-access.policy.port";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";

@Injectable()
export class VenueCreateBodyOwnerHttpGuard implements CanActivate {
  constructor(
    @Inject(VENUE_ACCESS_POLICY)
    private readonly policy: VenueAccessPolicyPort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      body: { ownerUserId?: string | null };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      this.policy.ensureCreateOwnerClause(userId, req.body?.ownerUserId);
      return true;
    } catch (e) {
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
