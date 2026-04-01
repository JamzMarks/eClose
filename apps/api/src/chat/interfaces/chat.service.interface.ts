import { Conversation } from "../entity/conversation.entity";
import { Message } from "../entity/message.entity";
import { ChatParticipantRef } from "../types/chat-participant-ref.type";

export interface IChatService {
  getOrCreateDirectConversation(
    a: ChatParticipantRef,
    b: ChatParticipantRef,
  ): Promise<Conversation>;

  createGroupConversation(
    title: string | undefined,
    members: ChatParticipantRef[],
  ): Promise<Conversation>;

  addGroupMember(
    conversationId: string,
    actor: ChatParticipantRef,
    newMember: ChatParticipantRef,
  ): Promise<Conversation>;

  sendMessage(
    conversationId: string,
    author: ChatParticipantRef,
    body: string,
  ): Promise<Message>;

  listMyConversations(actor: ChatParticipantRef): Promise<Conversation[]>;

  listMessages(
    conversationId: string,
    actor: ChatParticipantRef,
    options?: { limit?: number; before?: string },
  ): Promise<Message[]>;
}
