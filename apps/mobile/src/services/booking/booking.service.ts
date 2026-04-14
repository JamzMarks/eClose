import { getApiClient } from "@/services/api-client";
import type { BookingInquiryDto, CreateBookingInquiryBody } from "@/services/booking/booking.types";

export class BookingService {
  private readonly client = getApiClient();

  createInquiry(body: CreateBookingInquiryBody): Promise<BookingInquiryDto> {
    return this.client.post<BookingInquiryDto>("/booking/inquiries", body);
  }
}
