import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";

export class VenueOpeningSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  openLocal!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  closeLocal!: string;

  @IsOptional()
  @IsBoolean()
  closesNextDay?: boolean;
}
