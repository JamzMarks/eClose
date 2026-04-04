export interface IEventMediaPort {
  assertAndSetPrimary(eventId: string, mediaAssetId: string): Promise<void>;
}
