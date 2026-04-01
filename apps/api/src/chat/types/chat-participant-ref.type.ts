import { ChatEntityType } from "./chat-entity-type.type";

export type ChatParticipantRef = {
  entityType: ChatEntityType;
  entityId: string;
};

export function participantRefKey(ref: ChatParticipantRef): string {
  return `${ref.entityType}:${ref.entityId}`;
}

export function compareParticipantRefs(a: ChatParticipantRef, b: ChatParticipantRef): number {
  return participantRefKey(a).localeCompare(participantRefKey(b));
}

export function directConversationPairKey(a: ChatParticipantRef, b: ChatParticipantRef): string {
  const [first, second] = [a, b].sort(compareParticipantRefs);
  return `${participantRefKey(first)}::${participantRefKey(second)}`;
}
