import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/artist-unavailability.orm-entity";
import { VenueUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/venue-unavailability.orm-entity";
import { EventPersistenceModule } from "@/event/event-persistence.module";
import { ArtistModule } from "@/artist/artist.module";
import { VenueModule } from "@/venue/venue.module";
import { CalendarArtistOwnerHttpGuard } from "@/infrastructure/http/guards/calendar-artist-owner.http.guard";
import { CalendarVenueOwnerHttpGuard } from "@/infrastructure/http/guards/calendar-venue-owner.http.guard";
import { EXTERNAL_CALENDAR_PORT } from "@/calendar/application/ports/external-calendar.port";
import { NoopExternalCalendarAdapter } from "@/calendar/infrastructure/noop-external-calendar.adapter";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./application/calendar.service";
import { CALENDAR_SERVICE } from "./tokens/calendar.tokens";

@Module({
  imports: [
    EventPersistenceModule,
    TypeOrmModule.forFeature([ArtistUnavailabilityOrmEntity, VenueUnavailabilityOrmEntity]),
    ArtistModule,
    VenueModule,
  ],
  controllers: [CalendarController],
  providers: [
    { provide: CALENDAR_SERVICE, useClass: CalendarService },
    { provide: EXTERNAL_CALENDAR_PORT, useClass: NoopExternalCalendarAdapter },
    CalendarArtistOwnerHttpGuard,
    CalendarVenueOwnerHttpGuard,
  ],
  exports: [CALENDAR_SERVICE, EXTERNAL_CALENDAR_PORT],
})
export class CalendarModule {}
