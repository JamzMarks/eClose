import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { ArtistType } from "../types/artist.type";

export class CreateArtistDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug!: string;

  @IsEnum(ArtistType)
  type!: ArtistType;

  @IsUUID()
  ownerId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  bio?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  websiteUrl?: string;

  @IsOptional()
  @IsBoolean()
  marketplaceVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  openToVenueBookings?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  taxonomyTermIds?: string[];
}
