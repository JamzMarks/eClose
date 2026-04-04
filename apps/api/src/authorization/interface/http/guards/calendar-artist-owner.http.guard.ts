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
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";
import type { ArtistAccessPolicyPort } from "@/artist/application/ports/artist-access.policy.port";
import { ARTIST_ACCESS_POLICY } from "@/artist/application/ports/artist-access.policy.port";

@Injectable()
export class CalendarArtistOwnerHttpGuard implements CanActivate {
  constructor(
    @Inject(ARTIST_ACCESS_POLICY)
    private readonly policy: ArtistAccessPolicyPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      params: { artistId: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      await this.policy.ensureActorOwnsArtist(userId, req.params.artistId);
      return true;
    } catch (e) {
      if (e instanceof ResourceNotFoundError) throw new NotFoundException(e.message);
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
