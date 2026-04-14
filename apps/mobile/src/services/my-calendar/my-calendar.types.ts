/** Origem do evento guardado no calendário pessoal (filtros). */
export type MyCalendarEventSource = "mine" | "group" | "direct";

export type MyCalendarSavedEvent = {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  locationMode: string;
  locationLabel: string | null;
  source: MyCalendarEventSource;
  /** Lista partilhada, convite direto, etc. */
  contextLabel: string;
};

export type MyCalendarFilterId = "all" | MyCalendarEventSource;
