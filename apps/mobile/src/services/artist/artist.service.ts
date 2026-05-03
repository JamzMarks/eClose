import { getApiClient } from "@/services/api-client";
import type { IArtistService } from "@/services/artist/artist.service.interface";
import type { ArtistDto, CreateArtistRequest } from "@/contracts/artist.types";

export class ArtistService implements IArtistService {
  private readonly client = getApiClient();

  create(body: CreateArtistRequest): Promise<ArtistDto> {
    return this.client.post<ArtistDto>("/artists", body);
  }

  getById(id: string): Promise<ArtistDto> {
    return this.client.get<ArtistDto>(`/artists/${encodeURIComponent(id)}`);
  }

  linkPrimaryMedia(artistId: string, mediaAssetId: string): Promise<ArtistDto> {
    return this.client.patch<ArtistDto>(`/artists/${encodeURIComponent(artistId)}/primary-media`, {
      mediaAssetId,
    });
  }
}
