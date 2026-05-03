export type ChatConversationKind = "direct" | "group";

/** Sugestão para nova mensagem / novo grupo (mock local / futuro API). */
export type ChatNewMessageUserSuggestion = {
  id: string;
  displayName: string;
  subtitle?: string;
  avatarUrl?: string | null;
};

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

