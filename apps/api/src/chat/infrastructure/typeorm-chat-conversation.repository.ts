import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationOrmEntity } from "@/chat/infrastructure/persistence/conversation.orm-entity";
import { Conversation } from "../entity/conversation.entity";
import { IChatConversationRepository } from "../interfaces/chat-conversation.repository.interface";
import {
  ChatParticipantRef,
  directConversationPairKey,
  participantRefKey,
} from "../types/chat-participant-ref.type";
import { ConversationKind } from "../types/conversation-kind.type";

@Injectable()
export class TypeormChatConversationRepository implements IChatConversationRepository {
  constructor(
    @InjectRepository(ConversationOrmEntity)
    private readonly repo: Repository<ConversationOrmEntity>,
  ) {}

  async save(conversation: Conversation): Promise<void> {
    const row = this.toRow(conversation);
    await this.repo.save(row);
  }

  async findById(id: string): Promise<Conversation | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findDirectByParticipants(
    a: ChatParticipantRef,
    b: ChatParticipantRef,
  ): Promise<Conversation | null> {
    const key = directConversationPairKey(a, b);
    const row = await this.repo.findOne({ where: { directPairKey: key } });
    return row ? this.toDomain(row) : null;
  }

  async listByParticipant(ref: ChatParticipantRef): Promise<Conversation[]> {
    const rows = await this.repo
      .createQueryBuilder("c")
      .where(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements("c"."participant_refs") elem
          WHERE elem->>'entityType' = :et AND elem->>'entityId' = :eid
        )`,
        { et: ref.entityType, eid: ref.entityId },
      )
      .orderBy("c.updated_at", "DESC")
      .getMany();
    return rows.map((r) => this.toDomain(r));
  }

  private toRow(c: Conversation): ConversationOrmEntity {
    const row = new ConversationOrmEntity();
    row.id = c.id;
    row.kind = c.kind;
    row.participantRefs = c.participantRefs.map((p) => ({
      entityType: p.entityType,
      entityId: p.entityId,
    }));
    row.title = c.title ?? null;
    row.directPairKey =
      c.kind === ConversationKind.DIRECT && c.participantRefs.length === 2
        ? directConversationPairKey(c.participantRefs[0], c.participantRefs[1])
        : null;
    row.createdAt = c.createdAt;
    row.updatedAt = c.updatedAt;
    return row;
  }

  private toDomain(row: ConversationOrmEntity): Conversation {
    return Conversation.hydrate({
      id: row.id,
      kind: row.kind as ConversationKind,
      participantRefs: (row.participantRefs ?? []) as ChatParticipantRef[],
      title: row.title,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
