import { Artist } from "../entity/artist.entity";
import { CreateArtistDto } from "../dto/create-artist.dto";

export interface IArtistService {
  create(dto: CreateArtistDto): Promise<Artist>;
  getById(id: string): Promise<Artist | null>;
  linkPrimaryMedia(artistId: string, mediaAssetId: string): Promise<Artist>;
}
