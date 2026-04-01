import { IsISO8601 } from "class-validator";

export class ProposeBookingDatesDto {
  @IsISO8601()
  proposedStartsAt!: string;

  @IsISO8601()
  proposedEndsAt!: string;
}
