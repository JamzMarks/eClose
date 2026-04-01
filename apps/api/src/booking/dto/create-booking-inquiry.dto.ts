import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateBookingInquiryDto {
  @ValidateIf((o) => !o.venueId)
  @IsUUID()
  artistId?: string;

  @ValidateIf((o) => !o.artistId)
  @IsUUID()
  venueId?: string;

  /**
   * Obrigatório com `venueId`: artista do solicitante (deve ser dele) para validação de calendário
   * e criação de evento após booking confirmado.
   */
  @ValidateIf((o) => Boolean(o.venueId))
  @IsUUID()
  @IsNotEmpty()
  organizerArtistId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
