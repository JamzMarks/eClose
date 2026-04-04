import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { ArtistCreateBodyOwnerHttpGuard } from "@/authorization/interface/http/guards/artist-create-body-owner.http.guard";
import { ArtistResourceOwnerHttpGuard } from "@/authorization/interface/http/guards/artist-resource-owner.http.guard";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { LinkPrimaryMediaDto } from "./dto/link-primary-media.dto";
import { IArtistService } from "./interfaces/artist.service.interface";
import { ARTIST_SERVICE } from "./tokens/artist.tokens";

@Controller("artists")
export class ArtistController {
  constructor(
    @Inject(ARTIST_SERVICE)
    private readonly artists: IArtistService,
  ) {}

  @Post()
  @PrivateRoute()
  @UseGuards(ArtistCreateBodyOwnerHttpGuard)
  create(@Body() dto: CreateArtistDto) {
    return this.artists.create(dto);
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const a = await this.artists.getById(id);
    if (!a) throw new NotFoundException("Artista não encontrado");
    return a;
  }

  @Patch(":id/primary-media")
  @PrivateRoute()
  @UseGuards(ArtistResourceOwnerHttpGuard)
  linkPrimary(@Param("id") id: string, @Body() body: LinkPrimaryMediaDto) {
    return this.artists.linkPrimaryMedia(id, body.mediaAssetId);
  }
}
