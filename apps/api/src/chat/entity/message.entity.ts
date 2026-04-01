import { ChatParticipantRef } from "../types/chat-participant-ref.type";

export type MessageProps = {
  id: string;
  conversationId: string;
  authorRef: ChatParticipantRef;
  body: string;
  createdAt: Date;
};

export class Message {
  id: string;
  conversationId: string;
  authorRef: ChatParticipantRef;
  body: string;
  createdAt: Date;

  private constructor(props: MessageProps) {
    Object.assign(this, props);
  }

  static hydrate(props: MessageProps): Message {
    return new Message(props);
  }

  static create(props: Omit<MessageProps, "createdAt">): Message {
    if (!props.body?.trim()) throw new Error("Mensagem vazia");
    return new Message({
      ...props,
      body: props.body.trim(),
      createdAt: new Date(),
    });
  }
}
