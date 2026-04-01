import { Inject, Injectable } from "@nestjs/common";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import { IArtistMediaPort } from "../interfaces/artist-media.port.interface";

@Injectable()
export class LocalArtistMediaAdapter implements IArtistMediaPort {
  constructor(
    @Inject(MEDIA_SERVICE)
    private readonly media: IMediaService,
  ) {}

  async assertAndSetPrimary(artistId: string, mediaAssetId: string): Promise<void> {
    await this.media.assertBelongsTo(mediaAssetId, MediaParentType.ARTIST, artistId);
    await this.media.setPrimary(mediaAssetId);
  }
}
