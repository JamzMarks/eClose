import type { ChatConversationListItem } from "@/services/chat/chat-list.types";

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&w=256&q=75`;

const isoMinutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const isoHoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60_000).toISOString();
const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

/** Dados estáticos para a aba Chat (pré-backend). */
export const LOCAL_CHAT_CONVERSATIONS: ChatConversationListItem[] = [
  {
    id: "mock-c1",
    kind: "direct",
    title: "Joana Silva",
    avatarUrl: u("photo-1494790108377-be9c29b29330"),
    lastMessagePreview: "Combinado, envio a setlist até ao fim do dia.",
    lastMessageAt: isoMinutesAgo(12),
    unreadCount: 2,
  },
  {
    id: "mock-c2",
    kind: "direct",
    title: "Miguel Torres",
    avatarUrl: u("photo-1507003211169-0a1dd7228f2d"),
    lastMessagePreview: "O som no Lux estava impecável na última.",
    lastMessageAt: isoHoursAgo(3),
    unreadCount: 0,
  },
  {
    id: "mock-c3",
    kind: "direct",
    title: "Inês Marques · booking",
    avatarUrl: u("photo-1438761681033-6461ffad8d80"),
    lastMessagePreview: "Tens disponibilidade para 18 maio?",
    lastMessageAt: isoDaysAgo(1),
    unreadCount: 1,
  },
  {
    id: "mock-c4",
    kind: "direct",
    title: "Ricardo Almeida",
    avatarUrl: u("photo-1500648767791-00dcc994a43e"),
    lastMessagePreview: "Obrigado pelo contacto — fica pendente.",
    lastMessageAt: isoDaysAgo(4),
    unreadCount: 0,
  },
  {
    id: "mock-g1",
    kind: "group",
    title: "Ensaios · Jazz LX",
    avatarUrl: u("photo-1511192336575-5a79af67a629"),
    lastMessagePreview: "Carla: confirmo o estúdio às 19h.",
    lastMessageAt: isoMinutesAgo(45),
    unreadCount: 4,
  },
  {
    id: "mock-g2",
    kind: "group",
    title: "Booking abril — promotores",
    avatarUrl: u("photo-1470229722913-7c0e2dbbafd3"),
    lastMessagePreview: "André: lista fechada para o fim‑de‑semana.",
    lastMessageAt: isoHoursAgo(8),
    unreadCount: 0,
  },
  {
    id: "mock-g3",
    kind: "group",
    title: "Open mic Faro",
    avatarUrl: u("photo-1516280440614-37939bbacd81"),
    lastMessagePreview: "Quem leva a mesa de mistura?",
    lastMessageAt: isoDaysAgo(2),
    unreadCount: 0,
  },
];
