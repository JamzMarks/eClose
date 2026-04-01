import { IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from "class-validator";

export class CreateBookingInquiryDto {
  @ValidateIf((o) => !o.venueId)
  @IsUUID()
  artistId?: string;

  @ValidateIf((o) => !o.artistId)
  @IsUUID()
  venueId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
