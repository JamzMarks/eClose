import { IsIn, IsUUID } from "class-validator";
import { SharedEventListMemberRole } from "@/shared-event-list/domain/types/shared-event-list-member-role.type";

export class AddSharedEventListMemberDto {
  @IsUUID()
  userId!: string;

  @IsIn([SharedEventListMemberRole.EDITOR, SharedEventListMemberRole.VIEWER])
  role!: SharedEventListMemberRole.EDITOR | SharedEventListMemberRole.VIEWER;
}
