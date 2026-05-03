import type { ChatNewMessageUserSuggestion } from "@/types/entities/chat.types";

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&w=256&q=75`;

/** Sugestões para “Nova mensagem” e “Novo grupo” (pré-backend). */
export const LOCAL_CHAT_NEW_MESSAGE_SUGGESTIONS: ChatNewMessageUserSuggestion[] = [
  {
    id: "u-sug-1",
    displayName: "Joana Silva",
    subtitle: "Contactos frequentes",
    avatarUrl: u("photo-1494790108377-be9c29b29330"),
  },
  {
    id: "u-sug-2",
    displayName: "Miguel Torres",
    subtitle: "Mesmo venue · Lux",
    avatarUrl: u("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    id: "u-sug-3",
    displayName: "Inês Marques",
    subtitle: "Booking",
    avatarUrl: u("photo-1438761681033-6461ffad8d80"),
  },
  {
    id: "u-sug-4",
    displayName: "Ricardo Almeida",
    subtitle: "Promotor",
    avatarUrl: u("photo-1500648767791-00dcc994a43e"),
  },
  {
    id: "u-sug-5",
    displayName: "Carla Mendes",
    subtitle: "Artista · jazz",
    avatarUrl: u("photo-1544005313-94ddf0286df2"),
  },
  {
    id: "u-sug-6",
    displayName: "André Costa",
    subtitle: "Ensaios Jazz LX",
    avatarUrl: u("photo-1506794778202-cad84cf45f1d"),
  },
];
