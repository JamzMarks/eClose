import { IsEnum, IsUUID } from "class-validator";
import { ChatEntityType } from "../types/chat-entity-type.type";

export class ListConversationsQueryDto {
  @IsEnum(ChatEntityType)
  entityType: ChatEntityType;

  @IsUUID()
  entityId: string;
}
