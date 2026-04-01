import { Body, Controller, Get, Inject, Param, ParseEnumPipe, Patch, Post } from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { RegisterMediaAssetDto } from "./dto/register-media-asset.dto";
import { RequestUploadIntentDto } from "./dto/request-upload-intent.dto";
import { IMediaService } from "./interfaces/media.service.interface";
import { MEDIA_SERVICE } from "./tokens/media.tokens";
import { MediaParentType } from "./types/media-parent-type.type";

@Controller("media")
export class MediaController {
  constructor(
    @Inject(MEDIA_SERVICE)
    private readonly media: IMediaService,
  ) {}

  @Post("upload-intent")
  @PrivateRoute()
  uploadIntent(@Body() dto: RequestUploadIntentDto) {
    return this.media.requestSignedUploadIntent(dto);
  }

  @Post("assets")
  @PrivateRoute()
  register(@Body() dto: RegisterMediaAssetDto) {
    return this.media.registerAsset(dto);
  }

  @Get("parents/:parentType/:parentId")
  listByParent(
    @Param("parentType", new ParseEnumPipe(MediaParentType)) parentType: MediaParentType,
    @Param("parentId") parentId: string,
  ) {
    return this.media.listByParent(parentType, parentId);
  }

  @Patch("assets/:id/primary")
  @PrivateRoute()
  setPrimary(@Param("id") id: string) {
    return this.media.setPrimary(id);
  }
}
