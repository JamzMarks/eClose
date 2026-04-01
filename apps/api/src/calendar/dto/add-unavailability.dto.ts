import { IsISO8601, IsOptional, IsString, MaxLength } from "class-validator";

export class AddUnavailabilityDto {
  @IsISO8601()
  startsAt!: string;

  @IsISO8601()
  endsAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
