import { Message } from "../entity/message.entity";

export interface IChatMessageRepository {
  save(message: Message): Promise<void>;
  listByConversation(
    conversationId: string,
    options?: { limit?: number; before?: Date },
  ): Promise<Message[]>;
}
