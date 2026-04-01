import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { ConfirmBookingDatesDto } from "@/booking/dto/confirm-booking-dates.dto";
import { CreateBookingInquiryDto } from "@/booking/dto/create-booking-inquiry.dto";
import { CreateEventFromBookingDto } from "@/booking/dto/create-event-from-booking.dto";
import { DeclineBookingDto } from "@/booking/dto/decline-booking.dto";
import { ProposeBookingDatesDto } from "@/booking/dto/propose-booking-dates.dto";
import { Event } from "@/event/entity/event.entity";

export interface IBookingService {
  createInquiry(
    requesterUserId: string,
    dto: CreateBookingInquiryDto,
  ): Promise<BookingInquiryOrmEntity>;
  proposeDates(
    inquiryId: string,
    actorUserId: string,
    dto: ProposeBookingDatesDto,
  ): Promise<BookingInquiryOrmEntity>;
  confirmDates(
    inquiryId: string,
    requesterUserId: string,
    dto: ConfirmBookingDatesDto,
  ): Promise<BookingInquiryOrmEntity>;
  acceptBooking(inquiryId: string, actorUserId: string): Promise<BookingInquiryOrmEntity>;
  declineBooking(
    inquiryId: string,
    actorUserId: string,
    dto?: DeclineBookingDto,
  ): Promise<BookingInquiryOrmEntity>;
  cancelByRequester(inquiryId: string, requesterUserId: string): Promise<BookingInquiryOrmEntity>;
  createEventFromBooking(
    inquiryId: string,
    actorUserId: string,
    dto: CreateEventFromBookingDto,
  ): Promise<{ inquiry: BookingInquiryOrmEntity; event: Event }>;
}
