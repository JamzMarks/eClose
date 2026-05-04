import type { ChatMessageBubble } from "@/types/entities/chat.types";

const agoMin = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/** Mensagens mock por conversa (mesma ordem cronológica: mais antiga → mais recente). */
export const MOCK_CHAT_MESSAGES: Record<string, ChatMessageBubble[]> = {
  "mock-c1": [
    {
      id: "c1-1",
      sentAt: agoMin(180),
      body: "Olá! Confirmas o slot para o ensaio?",
      from: "peer",
    },
    {
      id: "c1-2",
      sentAt: agoMin(170),
      body: "Sim, quinta funciona. Envio detalhes logo.",
      from: "me",
    },
    {
      id: "c1-3",
      sentAt: agoMin(90),
      body: "Perfeito. O backline está no rider?",
      from: "peer",
    },
    {
      id: "c1-4",
      sentAt: agoMin(12),
      body: "Combinado, envio a setlist até ao fim do dia.",
      from: "peer",
    },
  ],
  "mock-c2": [
    { id: "c2-1", sentAt: agoMin(400), body: "Viste o lineup da próxima semana?", from: "peer" },
    { id: "c2-2", sentAt: agoMin(380), body: "Ainda não — partilhas link?", from: "me" },
    {
      id: "c2-3",
      sentAt: agoMin(180),
      body: "O som no Lux estava impecável na última.",
      from: "peer",
    },
  ],
  "mock-c3": [
    {
      id: "c3-1",
      sentAt: agoMin(1440),
      body: "Olá Inês, obrigado pelo retorno.",
      from: "me",
    },
    {
      id: "c3-2",
      sentAt: agoMin(1400),
      body: "Tens disponibilidade para 18 maio?",
      from: "peer",
    },
  ],
  "mock-c4": [
    { id: "c4-1", sentAt: agoMin(6000), body: "Deixo aqui o contacto da técnica.", from: "peer" },
    {
      id: "c4-2",
      sentAt: agoMin(5900),
      body: "Obrigado pelo contacto — fica pendente.",
      from: "peer",
    },
  ],
  "mock-g1": [
    { id: "g1-1", sentAt: agoMin(300), body: "Quem leva os cabos XLR longos?", from: "peer" },
    { id: "g1-2", sentAt: agoMin(280), body: "Eu levo — tenho spares.", from: "me" },
    {
      id: "g1-3",
      sentAt: agoMin(45),
      body: "Carla: confirmo o estúdio às 19h.",
      from: "peer",
    },
  ],
  "mock-g2": [
    { id: "g2-1", sentAt: agoMin(500), body: "Lista de artistas fechada?", from: "me" },
    {
      id: "g2-2",
      sentAt: agoMin(480),
      body: "André: lista fechada para o fim‑de‑semana.",
      from: "peer",
    },
  ],
  "mock-g3": [
    { id: "g3-1", sentAt: agoMin(3000), body: "Alguém confirma horário de soundcheck?", from: "peer" },
    {
      id: "g3-2",
      sentAt: agoMin(2900),
      body: "Quem leva a mesa de mistura?",
      from: "peer",
    },
  ],
};

export function getMockConversationMessages(conversationId: string): ChatMessageBubble[] {
  return MOCK_CHAT_MESSAGES[conversationId] ?? [];
}
