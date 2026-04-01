import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";
import { BookingService } from "./booking.service";
import { ConfirmBookingDatesDto } from "./dto/confirm-booking-dates.dto";
import { CreateBookingInquiryDto } from "./dto/create-booking-inquiry.dto";

@Controller("booking")
@PrivateRoute()
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Post("inquiries")
  createInquiry(@CurrentUser() user: JwtValidatedUser, @Body() dto: CreateBookingInquiryDto) {
    return this.booking.createInquiry(user.id, dto);
  }

  @Patch("inquiries/:id/confirm-dates")
  confirmDates(
    @CurrentUser() user: JwtValidatedUser,
    @Param("id") id: string,
    @Body() dto: ConfirmBookingDatesDto,
  ) {
    return this.booking.confirmDates(id, user.id, dto);
  }
}
