import { IsEnum, IsInt, IsISO8601, IsOptional, IsUUID, Max, Min } from "class-validator";
import { ChatEntityType } from "../types/chat-entity-type.type";

export class ListMessagesQueryDto {
  @IsEnum(ChatEntityType)
  entityType: ChatEntityType;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @IsISO8601()
  before?: string;
}
