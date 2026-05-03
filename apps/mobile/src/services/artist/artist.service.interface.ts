import type { ArtistDto, CreateArtistRequest } from "@/contracts/artist.types";

export interface IArtistService {
  create(body: CreateArtistRequest): Promise<ArtistDto>;
  getById(id: string): Promise<ArtistDto>;
  linkPrimaryMedia(artistId: string, mediaAssetId: string): Promise<ArtistDto>;
}
