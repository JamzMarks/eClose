import { IsEnum, IsUUID } from "class-validator";
import { ChatEntityType } from "../types/chat-entity-type.type";

export class ChatParticipantRefDto {
  @IsEnum(ChatEntityType)
  entityType: ChatEntityType;

  @IsUUID()
  entityId: string;
}
