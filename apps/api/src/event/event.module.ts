import { Module } from "@nestjs/common";
import { TaxonomyModule } from "@/taxonomy/taxonomy.module";
import { VenueModule } from "@/venue/venue.module";
import { MediaModule } from "@/media/media.module";
import { ArtistModule } from "@/artist/artist.module";
import { CalendarModule } from "@/calendar/calendar.module";
import { EventOrganizerBodyHttpGuard } from "@/infrastructure/http/guards/event-organizer-body.http.guard";
import { EventResourceOrganizerHttpGuard } from "@/infrastructure/http/guards/event-resource-organizer.http.guard";
import { EventController } from "./event.controller";
import { EventService } from "./application/event.service";
import { EventPersistenceModule } from "./event-persistence.module";
import { EventAccessPolicyImpl } from "./infrastructure/event-access.policy.impl";
import { HttpEventMediaAdapter } from "./infrastructure/http-event-media.adapter";
import { LocalEventMediaAdapter } from "./infrastructure/local-event-media.adapter";
import { EVENT_ACCESS_POLICY } from "./application/ports/event-access.policy.port";
import { EVENT_MEDIA_PORT } from "./tokens/event-media.tokens";
import { EVENT_SERVICE } from "./tokens/event.tokens";

const eventMediaProvider = {
  provide: EVENT_MEDIA_PORT,
  useClass: process.env.MEDIA_ADAPTER === "http" ? HttpEventMediaAdapter : LocalEventMediaAdapter,
};

@Module({
  imports: [
    EventPersistenceModule,
    TaxonomyModule,
    VenueModule,
    MediaModule,
    ArtistModule,
    CalendarModule,
  ],
  controllers: [EventController],
  providers: [
    { provide: EVENT_ACCESS_POLICY, useClass: EventAccessPolicyImpl },
    eventMediaProvider,
    { provide: EVENT_SERVICE, useClass: EventService },
    EventOrganizerBodyHttpGuard,
    EventResourceOrganizerHttpGuard,
  ],
  exports: [EVENT_SERVICE, EventPersistenceModule, EVENT_ACCESS_POLICY],
})
export class EventModule {}
