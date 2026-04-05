import { IsUUID } from "class-validator";

export class AddSharedEventListEventDto {
  @IsUUID()
  eventId!: string;
}
