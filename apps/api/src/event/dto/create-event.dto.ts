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
import { EventAdhocAddressDto } from "./event-adhoc-address.dto";
import { EventLocationMode } from "../types/event-location-mode.type";
import { EventStatus } from "../types/event-status.type";

export class CreateEventDto {
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

  /** UX sem venue: título curto do lugar (“Festa na minha casa”) */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  locationLabel?: string;

  /** Instruções livres; integrações futuras podem parsear ou exibir como texto */
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  locationNotes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventAdhocAddressDto)
  adhocAddress?: EventAdhocAddressDto;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone!: string;

  @IsUUID()
  organizerArtistId!: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  taxonomyTermIds?: string[];

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
