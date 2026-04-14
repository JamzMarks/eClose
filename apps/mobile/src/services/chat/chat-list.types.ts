export type ChatConversationKind = "direct" | "group";

/** Item de lista para a aba Chat (mock local / futuro serviço). */
export type ChatConversationListItem = {
  id: string;
  kind: ChatConversationKind;
  title: string;
  avatarUrl: string | null;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount?: number;
};
