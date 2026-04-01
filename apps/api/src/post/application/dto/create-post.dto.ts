import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from "class-validator";
import { PostScopeType } from "@/post/domain/post-scope.type";

export class CreatePostDto {
  @IsEnum(PostScopeType)
  scopeType!: PostScopeType;

  @ValidateIf((o) => o.scopeType !== PostScopeType.GLOBAL_FEED)
  @IsUUID()
  scopeId?: string;

  @IsString()
  @MaxLength(8000)
  body!: string;
}
