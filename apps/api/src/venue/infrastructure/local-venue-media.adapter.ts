import { Inject, Injectable } from "@nestjs/common";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import { IVenueMediaPort } from "../interfaces/venue-media.port.interface";

@Injectable()
export class LocalVenueMediaAdapter implements IVenueMediaPort {
  constructor(
    @Inject(MEDIA_SERVICE)
    private readonly media: IMediaService,
  ) {}

  async assertAndSetPrimary(venueId: string, mediaAssetId: string): Promise<void> {
    await this.media.assertBelongsTo(mediaAssetId, MediaParentType.VENUE, venueId);
    await this.media.setPrimary(mediaAssetId);
  }
}
