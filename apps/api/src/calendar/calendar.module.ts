import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/artist-unavailability.orm-entity";
import { VenueUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/venue-unavailability.orm-entity";
import { EventPersistenceModule } from "@/event/event-persistence.module";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";
import { CALENDAR_SERVICE } from "./tokens/calendar.tokens";

@Module({
  imports: [
    EventPersistenceModule,
    TypeOrmModule.forFeature([ArtistUnavailabilityOrmEntity, VenueUnavailabilityOrmEntity]),
  ],
  controllers: [CalendarController],
  providers: [{ provide: CALENDAR_SERVICE, useClass: CalendarService }],
  exports: [CALENDAR_SERVICE],
})
export class CalendarModule {}
