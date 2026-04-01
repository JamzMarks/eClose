import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { Conversation } from "@/chat/entity/conversation.entity";
import { Message } from "@/chat/entity/message.entity";
import { IChatConversationRepository } from "@/chat/interfaces/chat-conversation.repository.interface";
import { IChatMessageRepository } from "@/chat/interfaces/chat-message.repository.interface";
import { IChatService } from "@/chat/interfaces/chat.service.interface";
import {
  CHAT_CONVERSATION_REPOSITORY,
  CHAT_MESSAGE_REPOSITORY,
} from "@/chat/tokens/chat.tokens";
import {
  ChatParticipantRef,
  participantRefKey,
} from "@/chat/types/chat-participant-ref.type";
import { ConversationKind } from "@/chat/types/conversation-kind.type";
import { ChatEntityType } from "@/chat/types/chat-entity-type.type";
import {
  USER_BLOCK_REPOSITORY,
  IUserBlockRepository,
} from "@/friendship/application/ports/user-block.repository.port";

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IdGenerator,
    @Inject(CHAT_CONVERSATION_REPOSITORY)
    private readonly conversations: IChatConversationRepository,
    @Inject(CHAT_MESSAGE_REPOSITORY)
    private readonly messages: IChatMessageRepository,
    @Inject(USER_BLOCK_REPOSITORY)
    private readonly userBlocks: IUserBlockRepository,
  ) {}

  private async assertDirectUserPairNotBlocked(a: ChatParticipantRef, b: ChatParticipantRef): Promise<void> {
    if (a.entityType !== ChatEntityType.USER || b.entityType !== ChatEntityType.USER) {
      return;
    }
    if (await this.userBlocks.existsBetween(a.entityId, b.entityId)) {
      throw new ForbiddenException("Bloqueio impede esta conversa direta");
    }
  }

  private async assertDirectConversationNotBlocked(conversation: Conversation): Promise<void> {
    if (conversation.kind !== ConversationKind.DIRECT) return;
    const users = conversation.participantRefs.filter((p) => p.entityType === ChatEntityType.USER);
    if (users.length === 2) {
      await this.assertDirectUserPairNotBlocked(users[0], users[1]);
    }
  }

  async getOrCreateDirectConversation(
    a: ChatParticipantRef,
    b: ChatParticipantRef,
  ): Promise<Conversation> {
    if (participantRefKey(a) === participantRefKey(b)) {
      throw new BadRequestException("Conversa direta requer dois participantes distintos");
    }
    const existing = await this.conversations.findDirectByParticipants(a, b);
    if (existing) {
      await this.assertDirectConversationNotBlocked(existing);
      return existing;
    }
    await this.assertDirectUserPairNotBlocked(a, b);
    const conversation = Conversation.createDirect({
      id: this.idGenerator.generate(),
      participantRefs: [a, b],
    });
    await this.conversations.save(conversation);
    return conversation;
  }

  async createGroupConversation(
    title: string | undefined,
    members: ChatParticipantRef[],
  ): Promise<Conversation> {
    const unique = this.uniqueParticipants(members);
    if (unique.length < 2) {
      throw new BadRequestException("Grupo requer pelo menos dois participantes distintos");
    }
    const conversation = Conversation.createGroup({
      id: this.idGenerator.generate(),
      participantRefs: unique,
      title: title?.trim() || null,
    });
    await this.conversations.save(conversation);
    return conversation;
  }

  async addGroupMember(
    conversationId: string,
    actor: ChatParticipantRef,
    newMember: ChatParticipantRef,
  ): Promise<Conversation> {
    const conversation = await this.requireConversation(conversationId);
    if (conversation.kind !== ConversationKind.GROUP) {
      throw new BadRequestException("Somente conversas em grupo permitem adicionar membros");
    }
    if (!conversation.hasParticipant(actor)) {
      throw new ForbiddenException("Participante não pertence à conversa");
    }
    conversation.addParticipant(newMember);
    await this.conversations.save(conversation);
    return conversation;
  }

  async sendMessage(
    conversationId: string,
    author: ChatParticipantRef,
    body: string,
  ): Promise<Message> {
    const conversation = await this.requireConversation(conversationId);
    if (!conversation.hasParticipant(author)) {
      throw new ForbiddenException("Autor não participa desta conversa");
    }
    await this.assertDirectConversationNotBlocked(conversation);
    const message = Message.create({
      id: this.idGenerator.generate(),
      conversationId,
      authorRef: author,
      body,
    });
    conversation.touch();
    await this.conversations.save(conversation);
    await this.messages.save(message);
    return message;
  }

  async listMyConversations(actor: ChatParticipantRef): Promise<Conversation[]> {
    return this.conversations.listByParticipant(actor);
  }

  async listMessages(
    conversationId: string,
    actor: ChatParticipantRef,
    options?: { limit?: number; before?: string },
  ): Promise<Message[]> {
    const conversation = await this.requireConversation(conversationId);
    if (!conversation.hasParticipant(actor)) {
      throw new ForbiddenException("Participante não pertence à conversa");
    }
    await this.assertDirectConversationNotBlocked(conversation);
    const before = options?.before ? new Date(options.before) : undefined;
    if (options?.before && Number.isNaN(before!.getTime())) {
      throw new BadRequestException("Parâmetro before inválido (use ISO-8601)");
    }
    return this.messages.listByConversation(conversationId, {
      limit: options?.limit,
      before,
    });
  }

  private async requireConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversations.findById(id);
    if (!conversation) throw new NotFoundException("Conversa não encontrada");
    return conversation;
  }

  private uniqueParticipants(members: ChatParticipantRef[]): ChatParticipantRef[] {
    const seen = new Set<string>();
    const out: ChatParticipantRef[] = [];
    for (const m of members) {
      const k = participantRefKey(m);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(m);
    }
    return out;
  }
}
