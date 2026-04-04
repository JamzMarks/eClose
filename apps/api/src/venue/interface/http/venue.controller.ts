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
import { VenueCreateBodyOwnerHttpGuard } from "@/authorization/interface/http/guards/venue-create-body-owner.http.guard";
import { VenueResourceOwnerHttpGuard } from "@/authorization/interface/http/guards/venue-resource-owner.http.guard";
import { CreateVenueDto } from "./dto/create-venue.dto";
import { LinkPrimaryMediaDto } from "./dto/link-primary-media.dto";
import { IVenueService } from "@/venue/application/ports/venue.service.interface";
import { VENUE_SERVICE } from "@/venue/application/tokens/venue.tokens";

@Controller("venues")
export class VenueController {
  constructor(
    @Inject(VENUE_SERVICE)
    private readonly venues: IVenueService,
  ) {}

  @Post()
  @PrivateRoute()
  @UseGuards(VenueCreateBodyOwnerHttpGuard)
  create(@Body() dto: CreateVenueDto) {
    return this.venues.create(dto);
  }

  @Get()
  list() {
    return this.venues.listPublicMarketplace();
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const v = await this.venues.getPublicById(id);
    if (!v) throw new NotFoundException("Venue não encontrado");
    return v;
  }

  @Patch(":id/primary-media")
  @PrivateRoute()
  @UseGuards(VenueResourceOwnerHttpGuard)
  linkPrimary(@Param("id") id: string, @Body() body: LinkPrimaryMediaDto) {
    return this.venues.linkPrimaryMedia(id, body.mediaAssetId);
  }
}
