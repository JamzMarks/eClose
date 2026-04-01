import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { OAuthProviderId } from "../types/oauth-provider-id.type";

export class OAuthCallbackDto {
  @IsEnum(OAuthProviderId)
  provider!: OAuthProviderId;

  @IsString()
  @MinLength(1)
  code!: string;

  @IsUrl({ require_tld: false })
  redirectUri!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  codeVerifier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  state?: string;
}
