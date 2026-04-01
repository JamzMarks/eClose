import { ConversationKind } from "../types/conversation-kind.type";
import { ChatParticipantRef } from "../types/chat-participant-ref.type";

export type ConversationProps = {
  id: string;
  kind: ConversationKind;
  participantRefs: ChatParticipantRef[];
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Conversation {
  id: string;
  kind: ConversationKind;
  participantRefs: ChatParticipantRef[];
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: ConversationProps) {
    Object.assign(this, props);
  }

  static hydrate(props: ConversationProps): Conversation {
    return new Conversation(props);
  }

  static createDirect(props: {
    id: string;
    participantRefs: [ChatParticipantRef, ChatParticipantRef];
  }): Conversation {
    const now = new Date();
    return new Conversation({
      id: props.id,
      kind: ConversationKind.DIRECT,
      participantRefs: [...props.participantRefs],
      title: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static createGroup(props: {
    id: string;
    participantRefs: ChatParticipantRef[];
    title?: string | null;
  }): Conversation {
    const now = new Date();
    return new Conversation({
      id: props.id,
      kind: ConversationKind.GROUP,
      participantRefs: [...props.participantRefs],
      title: props.title ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  touch(): void {
    this.updatedAt = new Date();
  }

  hasParticipant(ref: ChatParticipantRef): boolean {
    const key = `${ref.entityType}:${ref.entityId}`;
    return this.participantRefs.some(
      (p) => `${p.entityType}:${p.entityId}` === key,
    );
  }

  addParticipant(ref: ChatParticipantRef): void {
    if (this.kind !== ConversationKind.GROUP) {
      throw new Error("Apenas conversas em grupo aceitam novos participantes");
    }
    if (this.hasParticipant(ref)) return;
    this.participantRefs.push(ref);
    this.touch();
  }
}
