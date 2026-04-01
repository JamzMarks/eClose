import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationOrmEntity } from "@/chat/infrastructure/persistence/conversation.orm-entity";
import { MessageOrmEntity } from "@/chat/infrastructure/persistence/message.orm-entity";
import { ChatController } from "./chat.controller";
import { ChatService } from "./application/chat.service";
import { TypeormChatConversationRepository } from "./infrastructure/typeorm-chat-conversation.repository";
import { TypeormChatMessageRepository } from "./infrastructure/typeorm-chat-message.repository";
import {
  CHAT_CONVERSATION_REPOSITORY,
  CHAT_MESSAGE_REPOSITORY,
  CHAT_SERVICE,
} from "./tokens/chat.tokens";
import { FriendshipModule } from "@/friendship/friendship.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationOrmEntity, MessageOrmEntity]),
    FriendshipModule,
  ],
  controllers: [ChatController],
  providers: [
    {
      provide: CHAT_CONVERSATION_REPOSITORY,
      useClass: TypeormChatConversationRepository,
    },
    {
      provide: CHAT_MESSAGE_REPOSITORY,
      useClass: TypeormChatMessageRepository,
    },
    {
      provide: CHAT_SERVICE,
      useClass: ChatService,
    },
  ],
  exports: [CHAT_SERVICE],
})
export class ChatModule {}
