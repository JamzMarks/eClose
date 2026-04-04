import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { VenueAddressDto } from "./venue-address.dto";
import { VenueOpeningSlotDto } from "./venue-opening-slot.dto";

export class CreateVenueDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @ValidateNested()
  @Type(() => VenueAddressDto)
  address!: VenueAddressDto;

  @IsOptional()
  @IsNumber()
  geoLat?: number;

  @IsOptional()
  @IsNumber()
  geoLng?: number;

  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VenueOpeningSlotDto)
  openingHours!: VenueOpeningSlotDto[];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  taxonomyTermIds?: string[];

  @IsOptional()
  @IsBoolean()
  marketplaceListed?: boolean;

  @IsOptional()
  @IsBoolean()
  openToArtistInquiries?: boolean;
}
