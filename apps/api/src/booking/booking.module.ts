import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { ArtistModule } from "@/artist/artist.module";
import { CalendarModule } from "@/calendar/calendar.module";
import { ChatModule } from "@/chat/chat.module";
import { VenueModule } from "@/venue/venue.module";
import { EventModule } from "@/event/event.module";
import { NotificationModule } from "@/notification/notification.module";
import { BookingInquiryCounterpartHttpGuard } from "@/infrastructure/http/guards/booking-inquiry-counterpart.http.guard";
import { BookingInquiryRequesterHttpGuard } from "@/infrastructure/http/guards/booking-inquiry-requester.http.guard";
import { BOOKING_ACCESS_POLICY } from "@/booking/application/ports/booking-access.policy.port";
import { BookingAccessPolicyImpl } from "@/booking/infrastructure/booking-access.policy.impl";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";

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
    BookingService,
    { provide: BOOKING_ACCESS_POLICY, useClass: BookingAccessPolicyImpl },
    BookingInquiryRequesterHttpGuard,
    BookingInquiryCounterpartHttpGuard,
  ],
})
export class BookingModule {}
