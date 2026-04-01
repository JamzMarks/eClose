/**
 * Política de acesso a recursos de artista (domínio / aplicação; sem Nest).
 */
export interface ArtistAccessPolicyPort {
  ensureActorOwnsArtist(actorUserId: string, artistId: string): Promise<void>;
  ensureClaimedOwnerIsActor(actorUserId: string, claimedOwnerId: string): void;
}

export const ARTIST_ACCESS_POLICY = Symbol("ARTIST_ACCESS_POLICY");
