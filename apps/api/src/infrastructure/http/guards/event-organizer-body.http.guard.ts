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
import type { EventAccessPolicyPort } from "@/event/application/ports/event-access.policy.port";
import { EVENT_ACCESS_POLICY } from "@/event/application/ports/event-access.policy.port";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";

@Injectable()
export class EventOrganizerBodyHttpGuard implements CanActivate {
  constructor(
    @Inject(EVENT_ACCESS_POLICY)
    private readonly policy: EventAccessPolicyPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      body: { organizerArtistId?: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    const aid = req.body?.organizerArtistId;
    if (!aid) return true;
    try {
      await this.policy.ensureOrganizerArtistBelongsToActor(userId, aid);
      return true;
    } catch (e) {
      if (e instanceof ResourceNotFoundError) throw new NotFoundException(e.message);
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
