import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageOrmEntity } from "@/chat/infrastructure/persistence/message.orm-entity";
import { Message } from "../entity/message.entity";
import { IChatMessageRepository } from "../interfaces/chat-message.repository.interface";
import { ChatParticipantRef } from "../types/chat-participant-ref.type";

@Injectable()
export class TypeormChatMessageRepository implements IChatMessageRepository {
  constructor(
    @InjectRepository(MessageOrmEntity)
    private readonly repo: Repository<MessageOrmEntity>,
  ) {}

  async save(message: Message): Promise<void> {
    await this.repo.save(this.toRow(message));
  }

  async listByConversation(
    conversationId: string,
    options?: { limit?: number; before?: Date },
  ): Promise<Message[]> {
    const limit = Math.min(options?.limit ?? 50, 200);
    const qb = this.repo
      .createQueryBuilder("m")
      .where("m.conversationId = :conversationId", { conversationId })
      .orderBy("m.createdAt", "DESC")
      .take(limit);
    if (options?.before) {
      qb.andWhere("m.createdAt < :before", { before: options.before });
    }
    const rows = await qb.getMany();
    return rows.reverse().map((r) => this.toDomain(r));
  }

  private toRow(m: Message): MessageOrmEntity {
    const row = new MessageOrmEntity();
    row.id = m.id;
    row.conversationId = m.conversationId;
    row.authorRef = { entityType: m.authorRef.entityType, entityId: m.authorRef.entityId };
    row.body = m.body;
    row.createdAt = m.createdAt;
    return row;
  }

  private toDomain(row: MessageOrmEntity): Message {
    return Message.hydrate({
      id: row.id,
      conversationId: row.conversationId,
      authorRef: row.authorRef as ChatParticipantRef,
      body: row.body,
      createdAt: row.createdAt,
    });
  }
}
