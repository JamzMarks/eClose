import { ArrayMaxSize, IsArray, IsString, MaxLength } from "class-validator";

const MAX_TOKENS = 32;
const MAX_TOKEN_LEN = 512;

export class UpdatePushTokensDto {
  @IsArray()
  @ArrayMaxSize(MAX_TOKENS)
  @IsString({ each: true })
  @MaxLength(MAX_TOKEN_LEN, { each: true })
  pushTokens!: string[];
}
