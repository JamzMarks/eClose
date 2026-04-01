import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { OAuthProviderId } from "../types/oauth-provider-id.type";

export class OAuthStartDto {
  @IsEnum(OAuthProviderId)
  provider!: OAuthProviderId;

  @IsUrl({ require_tld: false })
  redirectUri!: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  state?: string;
}
