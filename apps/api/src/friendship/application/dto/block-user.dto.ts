import { IsUUID } from "class-validator";

export class BlockUserDto {
  @IsUUID()
  blockedUserId!: string;
}
