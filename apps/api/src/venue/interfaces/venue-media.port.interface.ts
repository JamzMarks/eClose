/**
 * Porta MS-ready: valida asset e marca primário sem acoplar Venue ao MediaService concreto.
 */
export interface IVenueMediaPort {
  assertAndSetPrimary(venueId: string, mediaAssetId: string): Promise<void>;
}
