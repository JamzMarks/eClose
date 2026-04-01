import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from "class-validator";
import { MediaKind } from "../types/media-kind.type";
import { MediaParentType } from "../types/media-parent-type.type";

export class RegisterMediaAssetDto {
  @IsEnum(MediaParentType)
  parentType!: MediaParentType;

  @IsUUID()
  parentId!: string;

  @IsEnum(MediaKind)
  kind!: MediaKind;

  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  sourceUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  durationSeconds?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsBoolean()
  setAsPrimary?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  storageKey?: string;
}
