import { Inject, Injectable } from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import { IVenueRepository } from "../interfaces/venue.repository.interface";
import { VENUE_REPOSITORY } from "../tokens/venue.tokens";
import { VenueAccessPolicyPort } from "../application/ports/venue-access.policy.port";

@Injectable()
export class VenueAccessPolicyImpl implements VenueAccessPolicyPort {
  constructor(
    @Inject(VENUE_REPOSITORY)
    private readonly venues: IVenueRepository,
  ) {}

  ensureCreateOwnerClause(actorUserId: string, ownerUserId: string | null | undefined): void {
    if (ownerUserId != null && ownerUserId !== actorUserId) {
      throw new AccessDeniedError("ownerUserId deve ser o utilizador autenticado ou omitido");
    }
  }

  async ensureActorOwnsVenue(actorUserId: string, venueId: string): Promise<void> {
    const venue = await this.venues.findById(venueId);
    if (!venue) {
      throw new ResourceNotFoundError("Venue não encontrado");
    }
    if (!venue.ownerUserId || venue.ownerUserId !== actorUserId) {
      throw new AccessDeniedError("Apenas o dono pode alterar este venue");
    }
  }
}
