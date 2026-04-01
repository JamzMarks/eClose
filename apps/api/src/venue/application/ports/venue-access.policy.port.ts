export interface VenueAccessPolicyPort {
  ensureActorOwnsVenue(actorUserId: string, venueId: string): Promise<void>;
  ensureCreateOwnerClause(actorUserId: string, ownerUserId: string | null | undefined): void;
}

export const VENUE_ACCESS_POLICY = Symbol("VENUE_ACCESS_POLICY");
