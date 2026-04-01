import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import type { VenueAccessPolicyPort } from "@/venue/application/ports/venue-access.policy.port";
import { VENUE_ACCESS_POLICY } from "@/venue/application/ports/venue-access.policy.port";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";

@Injectable()
export class VenueResourceOwnerHttpGuard implements CanActivate {
  constructor(
    @Inject(VENUE_ACCESS_POLICY)
    private readonly policy: VenueAccessPolicyPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      params: { id: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      await this.policy.ensureActorOwnsVenue(userId, req.params.id);
      return true;
    } catch (e) {
      if (e instanceof ResourceNotFoundError) throw new NotFoundException(e.message);
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
