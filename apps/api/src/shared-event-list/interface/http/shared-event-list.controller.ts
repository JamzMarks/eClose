import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { SharedEventListService } from "@/shared-event-list/application/shared-event-list.service";
import { AddSharedEventListEventDto } from "@/shared-event-list/interface/http/dto/add-shared-event-list-event.dto";
import { AddSharedEventListMemberDto } from "@/shared-event-list/interface/http/dto/add-shared-event-list-member.dto";
import { CreateSharedEventListDto } from "@/shared-event-list/interface/http/dto/create-shared-event-list.dto";
import { UpdateSharedEventListDto } from "@/shared-event-list/interface/http/dto/update-shared-event-list.dto";

/**
 * Rotas mais específicas (`.../events`, `.../members`) antes de `:listId` para o router não
 * interpretar "events" como UUID.
 */
@Controller("shared-event-lists")
@PrivateRoute()
export class SharedEventListController {
  constructor(private readonly lists: SharedEventListService) {}

  @Post()
  create(@CurrentUser() user: JwtValidatedUser, @Body() dto: CreateSharedEventListDto) {
    return this.lists.create(user.id, dto.title);
  }

  @Get()
  listMine(@CurrentUser() user: JwtValidatedUser) {
    return this.lists.listMine(user.id);
  }

  @Get(":listId/events")
  listEvents(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
  ) {
    return this.lists.listEvents(user.id, listId);
  }

  @Post(":listId/events")
  addEvent(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
    @Body() dto: AddSharedEventListEventDto,
  ) {
    return this.lists.addEvent(user.id, listId, dto.eventId);
  }

  @Delete(":listId/events/:eventId")
  removeEvent(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
    @Param("eventId", new ParseUUIDPipe()) eventId: string,
  ) {
    return this.lists.removeEvent(user.id, listId, eventId);
  }

  @Post(":listId/members")
  addMember(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
    @Body() dto: AddSharedEventListMemberDto,
  ) {
    return this.lists.addMember(user.id, listId, dto.userId, dto.role);
  }

  @Delete(":listId/members/:userId")
  removeMember(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
    @Param("userId", new ParseUUIDPipe()) memberUserId: string,
  ) {
    return this.lists.removeMember(user.id, listId, memberUserId);
  }

  @Get(":listId")
  getOne(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
  ) {
    return this.lists.getDetail(user.id, listId);
  }

  @Patch(":listId")
  update(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
    @Body() dto: UpdateSharedEventListDto,
  ) {
    return this.lists.updateTitle(user.id, listId, dto.title);
  }

  @Delete(":listId")
  remove(
    @CurrentUser() user: JwtValidatedUser,
    @Param("listId", new ParseUUIDPipe()) listId: string,
  ) {
    return this.lists.deleteList(user.id, listId);
  }
}
