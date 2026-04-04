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
import type { ArtistAccessPolicyPort } from "@/artist/application/ports/artist-access.policy.port";
import { ARTIST_ACCESS_POLICY } from "@/artist/application/ports/artist-access.policy.port";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";

@Injectable()
export class ArtistResourceOwnerHttpGuard implements CanActivate {
  constructor(
    @Inject(ARTIST_ACCESS_POLICY)
    private readonly policy: ArtistAccessPolicyPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      params: { id: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      await this.policy.ensureActorOwnsArtist(userId, req.params.id);
      return true;
    } catch (e) {
      if (e instanceof ResourceNotFoundError) throw new NotFoundException(e.message);
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
