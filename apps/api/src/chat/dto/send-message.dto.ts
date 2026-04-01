import { Type } from "class-transformer";
import { IsString, MinLength, ValidateNested } from "class-validator";
import { ChatParticipantRefDto } from "./chat-participant-ref.dto";

export class SendMessageDto {
  @ValidateNested()
  @Type(() => ChatParticipantRefDto)
  author: ChatParticipantRefDto;

  @IsString()
  @MinLength(1)
  body: string;
}
