import { IsNumber, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class EventAdhocAddressDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  line1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  line2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string;

  @IsOptional()
  @IsNumber()
  geoLat?: number;

  @IsOptional()
  @IsNumber()
  geoLng?: number;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  externalPlaceRef?: string;
}
