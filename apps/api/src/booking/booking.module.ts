import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { ArtistModule } from "@/artist/artist.module";
import { CalendarModule } from "@/calendar/calendar.module";
import { ChatModule } from "@/chat/chat.module";
import { VenueModule } from "@/venue/venue.module";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingInquiryOrmEntity]),
    ChatModule,
    ArtistModule,
    VenueModule,
    CalendarModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
