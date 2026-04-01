import { Inject, Injectable } from "@nestjs/common";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import { IEventMediaPort } from "../interfaces/event-media.port.interface";

@Injectable()
export class LocalEventMediaAdapter implements IEventMediaPort {
  constructor(
    @Inject(MEDIA_SERVICE)
    private readonly media: IMediaService,
  ) {}

  async assertAndSetPrimary(eventId: string, mediaAssetId: string): Promise<void> {
    await this.media.assertBelongsTo(mediaAssetId, MediaParentType.EVENT, eventId);
    await this.media.setPrimary(mediaAssetId);
  }
}
