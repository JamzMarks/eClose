import { IsUUID } from "class-validator";

export class LinkPrimaryMediaDto {
  @IsUUID()
  mediaAssetId!: string;
}
