import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ChatParticipantRefDto } from "./chat-participant-ref.dto";

export class CreateDirectConversationDto {
  @ValidateNested()
  @Type(() => ChatParticipantRefDto)
  participantA: ChatParticipantRefDto;

  @ValidateNested()
  @Type(() => ChatParticipantRefDto)
  participantB: ChatParticipantRefDto;
}
