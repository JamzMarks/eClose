import { Type } from "class-transformer";
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class ListPublishedEventsQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsString()
  taxonomyTermIds?: string;

  @IsOptional()
  @IsUUID()
  venueId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  q?: string;

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

  @IsOptional()
  @IsIn(["startsAt", "createdAt", "title"])
  sortBy?: "startsAt" | "createdAt" | "title";

  @IsOptional()
  @Transform(({ value }) => (String(value).toUpperCase() === "DESC" ? "DESC" : "ASC"))
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC";
}
