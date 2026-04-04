import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import type { ArtistAccessPolicyPort } from "@/artist/application/ports/artist-access.policy.port";
import { ARTIST_ACCESS_POLICY } from "@/artist/application/ports/artist-access.policy.port";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";

@Injectable()
export class ArtistCreateBodyOwnerHttpGuard implements CanActivate {
  constructor(
    @Inject(ARTIST_ACCESS_POLICY)
    private readonly policy: ArtistAccessPolicyPort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      body: { ownerId?: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      this.policy.ensureClaimedOwnerIsActor(userId, req.body?.ownerId ?? "");
      return true;
    } catch (e) {
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
