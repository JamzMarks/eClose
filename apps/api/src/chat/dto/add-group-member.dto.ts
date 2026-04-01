import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ChatParticipantRefDto } from "./chat-participant-ref.dto";

export class AddGroupMemberDto {
  @ValidateNested()
  @Type(() => ChatParticipantRefDto)
  actor: ChatParticipantRefDto;

  @ValidateNested()
  @Type(() => ChatParticipantRefDto)
  newMember: ChatParticipantRefDto;
}
