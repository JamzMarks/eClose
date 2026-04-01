import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { ChatParticipantRefDto } from "./chat-participant-ref.dto";

export class CreateGroupConversationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatParticipantRefDto)
  members: ChatParticipantRefDto[];
}
