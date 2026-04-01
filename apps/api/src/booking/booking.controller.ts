import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { BookingInquiryCounterpartHttpGuard } from "@/infrastructure/http/guards/booking-inquiry-counterpart.http.guard";
import { BookingInquiryRequesterHttpGuard } from "@/infrastructure/http/guards/booking-inquiry-requester.http.guard";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";
import { BookingService } from "./booking.service";
import { ConfirmBookingDatesDto } from "./dto/confirm-booking-dates.dto";
import { CreateBookingInquiryDto } from "./dto/create-booking-inquiry.dto";
import { CreateEventFromBookingDto } from "./dto/create-event-from-booking.dto";
import { DeclineBookingDto } from "./dto/decline-booking.dto";
import { ProposeBookingDatesDto } from "./dto/propose-booking-dates.dto";

@Controller("booking")
@PrivateRoute()
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Post("inquiries")
  createInquiry(@CurrentUser() user: JwtValidatedUser, @Body() dto: CreateBookingInquiryDto) {
    return this.booking.createInquiry(user.id, dto);
  }

  @Patch("inquiries/:id/propose-dates")
  @UseGuards(BookingInquiryCounterpartHttpGuard)
  proposeDates(
    @CurrentUser() user: JwtValidatedUser,
    @Param("id") id: string,
    @Body() dto: ProposeBookingDatesDto,
  ) {
    return this.booking.proposeDates(id, user.id, dto);
  }

  @Patch("inquiries/:id/confirm-dates")
  @UseGuards(BookingInquiryRequesterHttpGuard)
  confirmDates(
    @CurrentUser() user: JwtValidatedUser,
    @Param("id") id: string,
    @Body() dto: ConfirmBookingDatesDto,
  ) {
    return this.booking.confirmDates(id, user.id, dto);
  }

  @Patch("inquiries/:id/accept")
  @UseGuards(BookingInquiryCounterpartHttpGuard)
  accept(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.booking.acceptBooking(id, user.id);
  }

  @Patch("inquiries/:id/decline")
  @UseGuards(BookingInquiryCounterpartHttpGuard)
  decline(
    @CurrentUser() user: JwtValidatedUser,
    @Param("id") id: string,
    @Body() dto: DeclineBookingDto,
  ) {
    return this.booking.declineBooking(id, user.id, dto);
  }

  @Patch("inquiries/:id/cancel")
  @UseGuards(BookingInquiryRequesterHttpGuard)
  cancel(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.booking.cancelByRequester(id, user.id);
  }

  @Post("inquiries/:id/create-event")
  @UseGuards(BookingInquiryCounterpartHttpGuard)
  createEventFromBooking(
    @CurrentUser() user: JwtValidatedUser,
    @Param("id") id: string,
    @Body() dto: CreateEventFromBookingDto,
  ) {
    return this.booking.createEventFromBooking(id, user.id, dto);
  }
}
