import { IsISO8601 } from "class-validator";

export class ConfirmBookingDatesDto {
  @IsISO8601()
  proposedStartsAt!: string;

  @IsISO8601()
  proposedEndsAt!: string;
}
