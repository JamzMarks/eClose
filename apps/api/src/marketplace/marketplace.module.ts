import { Module } from "@nestjs/common";
import { ArtistModule } from "@/artist/artist.module";
import { VenueModule } from "@/venue/venue.module";
import { MediaModule } from "@/media/media.module";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceService } from "./marketplace.service";
import { MARKETPLACE_SERVICE } from "./tokens/marketplace.tokens";

@Module({
  imports: [ArtistModule, VenueModule, MediaModule],
  controllers: [MarketplaceController],
  providers: [{ provide: MARKETPLACE_SERVICE, useClass: MarketplaceService }],
})
export class MarketplaceModule {}
