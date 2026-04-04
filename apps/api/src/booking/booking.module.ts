import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { ArtistModule } from "@/artist/artist.module";
import { CalendarModule } from "@/calendar/calendar.module";
import { ChatModule } from "@/chat/chat.module";
import { VenueModule } from "@/venue/venue.module";
import { EventModule } from "@/event/event.module";
import { NotificationModule } from "@/notification/notification.module";
import { BOOKING_ACCESS_POLICY } from "@/booking/application/ports/booking-access.policy.port";
import { BookingAccessPolicyImpl } from "@/booking/infrastructure/booking-access.policy.impl";
import { BookingController } from "./booking.controller";
import { BookingService } from "./application/booking.service";
import { BOOKING_SERVICE } from "./tokens/booking.tokens";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingInquiryOrmEntity]),
    ChatModule,
    ArtistModule,
    VenueModule,
    CalendarModule,
    EventModule,
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [
    { provide: BOOKING_SERVICE, useClass: BookingService },
    { provide: BOOKING_ACCESS_POLICY, useClass: BookingAccessPolicyImpl },
  ],
  exports: [BOOKING_SERVICE, BOOKING_ACCESS_POLICY],
})
export class BookingModule {}
