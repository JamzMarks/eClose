export interface IArtistMediaPort {
  assertAndSetPrimary(artistId: string, mediaAssetId: string): Promise<void>;
}
