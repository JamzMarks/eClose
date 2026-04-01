import { Conversation } from "../entity/conversation.entity";
import { ChatParticipantRef } from "../types/chat-participant-ref.type";

export interface IChatConversationRepository {
  save(conversation: Conversation): Promise<void>;
  findById(id: string): Promise<Conversation | null>;
  findDirectByParticipants(
    a: ChatParticipantRef,
    b: ChatParticipantRef,
  ): Promise<Conversation | null>;
  listByParticipant(ref: ChatParticipantRef): Promise<Conversation[]>;
}
