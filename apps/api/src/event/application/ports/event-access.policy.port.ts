export interface EventAccessPolicyPort {
  ensureOrganizerArtistBelongsToActor(actorUserId: string, organizerArtistId: string): Promise<void>;
  ensureActorManagesEvent(actorUserId: string, eventId: string): Promise<void>;
}

export const EVENT_ACCESS_POLICY = Symbol("EVENT_ACCESS_POLICY");
