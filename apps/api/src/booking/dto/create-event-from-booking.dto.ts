import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { EventAdhocAddressDto } from "@/event/interface/http/dto/event-adhoc-address.dto";
import { EventLocationMode } from "@/event/domain/types/event-location-mode.type";
import { EventStatus } from "@/event/domain/types/event-status.type";

/** Cria evento a partir de booking confirmado; datas vêm da inquiry se omitidas. */
export class CreateEventFromBookingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  description?: string;

  @IsEnum(EventLocationMode)
  locationMode!: EventLocationMode;

  @IsOptional()
  @IsUUID()
  venueId?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  onlineUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  locationLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  locationNotes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventAdhocAddressDto)
  adhocAddress?: EventAdhocAddressDto;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone!: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  taxonomyTermIds?: string[];

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
