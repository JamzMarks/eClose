import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";
import { SendFriendRequestDto } from "@/friendship/application/dto/send-friend-request.dto";
import { IFriendshipService } from "@/friendship/application/friendship.service.interface";
import { FRIENDSHIP_SERVICE } from "@/friendship/tokens/friendship.tokens";

@Controller("friendships")
@PrivateRoute()
export class FriendshipController {
  constructor(
    @Inject(FRIENDSHIP_SERVICE) private readonly friendships: IFriendshipService,
  ) {}

  @Post("requests")
  sendRequest(@CurrentUser() user: JwtValidatedUser, @Body() dto: SendFriendRequestDto) {
    return this.friendships.sendRequest(user.id, dto.toUserId);
  }

  @Get("requests/incoming")
  incoming(@CurrentUser() user: JwtValidatedUser) {
    return this.friendships.listPendingIncoming(user.id);
  }

  @Get("requests/outgoing")
  outgoing(@CurrentUser() user: JwtValidatedUser) {
    return this.friendships.listPendingOutgoing(user.id);
  }

  @Patch("requests/:id/accept")
  accept(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.friendships.acceptRequest(user.id, id);
  }

  @Patch("requests/:id/reject")
  reject(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.friendships.rejectRequest(user.id, id);
  }

  @Patch("requests/:id/cancel")
  cancel(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.friendships.cancelOutgoing(user.id, id);
  }

  @Get()
  listFriends(@CurrentUser() user: JwtValidatedUser) {
    return this.friendships.listFriends(user.id);
  }

  @Delete(":friendUserId")
  unfriend(@CurrentUser() user: JwtValidatedUser, @Param("friendUserId") friendUserId: string) {
    return this.friendships.unfriend(user.id, friendUserId);
  }
}
