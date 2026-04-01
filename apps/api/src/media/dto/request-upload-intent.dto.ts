import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { MediaKind } from "../types/media-kind.type";
import { MediaParentType } from "../types/media-parent-type.type";

export class RequestUploadIntentDto {
  @IsEnum(MediaParentType)
  parentType!: MediaParentType;

  @IsUUID()
  parentId!: string;

  @IsEnum(MediaKind)
  kind!: MediaKind;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  expectedMimeType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;
}
