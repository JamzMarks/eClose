import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ArtistModule } from "@/artist/artist.module";
import { BookingModule } from "@/booking/booking.module";
import { CalendarModule } from "@/calendar/calendar.module";
import { EventModule } from "@/event/event.module";
import { VenueModule } from "@/venue/venue.module";
import { ArtistCreateBodyOwnerHttpGuard } from "./interface/http/guards/artist-create-body-owner.http.guard";
import { ArtistResourceOwnerHttpGuard } from "./interface/http/guards/artist-resource-owner.http.guard";
import { BookingInquiryCounterpartHttpGuard } from "./interface/http/guards/booking-inquiry-counterpart.http.guard";
import { BookingInquiryRequesterHttpGuard } from "./interface/http/guards/booking-inquiry-requester.http.guard";
import { CalendarArtistOwnerHttpGuard } from "./interface/http/guards/calendar-artist-owner.http.guard";
import { CalendarVenueOwnerHttpGuard } from "./interface/http/guards/calendar-venue-owner.http.guard";
import { EventOrganizerBodyHttpGuard } from "./interface/http/guards/event-organizer-body.http.guard";
import { EventResourceOrganizerHttpGuard } from "./interface/http/guards/event-resource-organizer.http.guard";
import { PrivateJwtAuthGuard } from "./interface/http/guards/private-jwt-auth.guard";
import { SelfUserHttpGuard } from "./interface/http/guards/self-user.http.guard";
import { VenueCreateBodyOwnerHttpGuard } from "./interface/http/guards/venue-create-body-owner.http.guard";
import { VenueResourceOwnerHttpGuard } from "./interface/http/guards/venue-resource-owner.http.guard";

const httpResourceGuards = [
  PrivateJwtAuthGuard,
  SelfUserHttpGuard,
  VenueCreateBodyOwnerHttpGuard,
  VenueResourceOwnerHttpGuard,
  EventOrganizerBodyHttpGuard,
  EventResourceOrganizerHttpGuard,
  ArtistCreateBodyOwnerHttpGuard,
  ArtistResourceOwnerHttpGuard,
  BookingInquiryRequesterHttpGuard,
  BookingInquiryCounterpartHttpGuard,
  CalendarArtistOwnerHttpGuard,
  CalendarVenueOwnerHttpGuard,
];

/**
 * Camada de autorização HTTP: guards que delegam em **ports** de policy nos bounded contexts
 * (Venue, Event, Artist, Booking). Importa apenas os módulos necessários para resolver tokens
 * `*_ACCESS_POLICY`; não regista entidades de domínio próprias.
 */
@Global()
@Module({
  imports: [VenueModule, EventModule, ArtistModule, BookingModule, CalendarModule],
  providers: [
    ...httpResourceGuards,
    { provide: APP_GUARD, useClass: PrivateJwtAuthGuard },
  ],
  exports: httpResourceGuards,
})
export class AuthorizationModule {}
