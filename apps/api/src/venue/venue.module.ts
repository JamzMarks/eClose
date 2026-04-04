import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaxonomyModule } from "@/taxonomy/taxonomy.module";
import { MediaModule } from "@/media/media.module";
import { VenueOrmEntity } from "@/venue/infrastructure/persistence/venue.orm-entity";
import { HttpVenueMediaAdapter } from "./infrastructure/http-venue-media.adapter";
import { LocalVenueMediaAdapter } from "./infrastructure/local-venue-media.adapter";
import { TypeormVenueRepository } from "./infrastructure/typeorm-venue.repository";
import { VenueAccessPolicyImpl } from "./infrastructure/venue-access.policy.impl";
import { VenueController } from "./interface/http/venue.controller";
import { VenueService } from "./application/venue.service";
import { VENUE_ACCESS_POLICY } from "./application/ports/venue-access.policy.port";
import { VENUE_MEDIA_PORT } from "./application/tokens/venue-media.tokens";
import { VENUE_REPOSITORY, VENUE_SERVICE } from "./application/tokens/venue.tokens";

const venueMediaProvider = {
  provide: VENUE_MEDIA_PORT,
  useClass: process.env.MEDIA_ADAPTER === "http" ? HttpVenueMediaAdapter : LocalVenueMediaAdapter,
};

@Module({
  imports: [TypeOrmModule.forFeature([VenueOrmEntity]), TaxonomyModule, MediaModule],
  controllers: [VenueController],
  providers: [
    { provide: VENUE_REPOSITORY, useClass: TypeormVenueRepository },
    { provide: VENUE_ACCESS_POLICY, useClass: VenueAccessPolicyImpl },
    venueMediaProvider,
    { provide: VENUE_SERVICE, useClass: VenueService },
  ],
  exports: [VENUE_SERVICE, VENUE_REPOSITORY, VENUE_ACCESS_POLICY],
})
export class VenueModule {}
