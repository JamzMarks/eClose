import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min, ValidateIf } from "class-validator";
import { PostScopeType } from "@/post/domain/post-scope.type";

export class ListPostsQueryDto {
  @IsEnum(PostScopeType)
  scopeType!: PostScopeType;

  @ValidateIf((o) => o.scopeType !== PostScopeType.GLOBAL_FEED)
  @IsUUID()
  scopeId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
