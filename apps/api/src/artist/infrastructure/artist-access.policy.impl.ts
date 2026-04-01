import { Inject, Injectable } from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import { IArtistRepository } from "../interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "../tokens/artist.tokens";
import { ArtistAccessPolicyPort } from "../application/ports/artist-access.policy.port";

@Injectable()
export class ArtistAccessPolicyImpl implements ArtistAccessPolicyPort {
  constructor(
    @Inject(ARTIST_REPOSITORY)
    private readonly artists: IArtistRepository,
  ) {}

  ensureClaimedOwnerIsActor(actorUserId: string, claimedOwnerId: string): void {
    if (claimedOwnerId !== actorUserId) {
      throw new AccessDeniedError("ownerId deve ser o utilizador autenticado");
    }
  }

  async ensureActorOwnsArtist(actorUserId: string, artistId: string): Promise<void> {
    const artist = await this.artists.findById(artistId);
    if (!artist) {
      throw new ResourceNotFoundError("Artista não encontrado");
    }
    if (artist.ownerId !== actorUserId) {
      throw new AccessDeniedError("Apenas o dono pode alterar este artista");
    }
  }
}
