export const BookingInquiryStatus = {
  OPEN: "OPEN",
  NEGOTIATING: "NEGOTIATING",
  DATES_CONFIRMED: "DATES_CONFIRMED",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingInquiryStatusValue =
  (typeof BookingInquiryStatus)[keyof typeof BookingInquiryStatus];
