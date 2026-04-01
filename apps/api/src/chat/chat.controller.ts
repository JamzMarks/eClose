import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { CHAT_SERVICE } from "./tokens/chat.tokens";
import { IChatService } from "./interfaces/chat.service.interface";
import { CreateDirectConversationDto } from "./dto/create-direct-conversation.dto";
import { CreateGroupConversationDto } from "./dto/create-group-conversation.dto";
import { AddGroupMemberDto } from "./dto/add-group-member.dto";
import { SendMessageDto } from "./dto/send-message.dto";
import { ListConversationsQueryDto } from "./dto/list-conversations-query.dto";
import { ListMessagesQueryDto } from "./dto/list-messages-query.dto";

@Controller("chat")
@PrivateRoute()
export class ChatController {
  constructor(
    @Inject(CHAT_SERVICE)
    private readonly chat: IChatService,
  ) {}

  @Post("conversations/direct")
  createDirect(@Body() dto: CreateDirectConversationDto) {
    return this.chat.getOrCreateDirectConversation(dto.participantA, dto.participantB);
  }

  @Post("conversations/group")
  createGroup(@Body() dto: CreateGroupConversationDto) {
    return this.chat.createGroupConversation(dto.title, dto.members);
  }

  @Post("conversations/:conversationId/members")
  addMember(@Param("conversationId") conversationId: string, @Body() dto: AddGroupMemberDto) {
    return this.chat.addGroupMember(conversationId, dto.actor, dto.newMember);
  }

  @Get("conversations")
  listConversations(@Query() query: ListConversationsQueryDto) {
    return this.chat.listMyConversations({
      entityType: query.entityType,
      entityId: query.entityId,
    });
  }

  @Post("conversations/:conversationId/messages")
  sendMessage(@Param("conversationId") conversationId: string, @Body() dto: SendMessageDto) {
    return this.chat.sendMessage(conversationId, dto.author, dto.body);
  }

  @Get("conversations/:conversationId/messages")
  listMessages(@Param("conversationId") conversationId: string, @Query() query: ListMessagesQueryDto) {
    return this.chat.listMessages(
      conversationId,
      { entityType: query.entityType, entityId: query.entityId },
      { limit: query.limit, before: query.before },
    );
  }
}
