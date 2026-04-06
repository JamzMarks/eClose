import { Transform } from "class-transformer";
import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class SubmitVenueTrustVerificationDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(14)
  @MaxLength(22)
  cnpj!: string;

  @IsUUID()
  cnpjDocumentMediaAssetId!: string;

  @IsUUID()
  addressProofMediaAssetId!: string;
}
