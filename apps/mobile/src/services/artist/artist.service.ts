import { getApiClient } from "@/services/api-client";
import type { IArtistService } from "@/services/artist/artist.service.interface";
import type { ArtistDto, CreateArtistRequest } from "@/services/types/artist.types";

export class ArtistService implements IArtistService {
  private readonly client = getApiClient();

  create(body: CreateArtistRequest): Promise<ArtistDto> {
    return this.client.post<ArtistDto>("/artists", body);
  }
}
