import type { MyCalendarSavedEvent } from "@/types/entities/my-calendar.types";

const iso = (d: Date) => d.toISOString();

function addDays(base: Date, days: number, hour: number, minute: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * Eventos guardados de demonstração (listas, convites, organização própria).
 * Substituir por API quando existir endpoint agregado.
 */
export const LOCAL_MY_CALENDAR_EVENTS: MyCalendarSavedEvent[] = [
  {
    id: "cal-1",
    eventId: "mock-e1",
    title: "Indie Night — bandas emergentes",
    startsAt: iso(addDays(new Date(), 2, 21, 0)),
    endsAt: iso(addDays(new Date(), 2, 23, 30)),
    locationMode: "PHYSICAL",
    locationLabel: "Lux Frágil · Lisboa",
    source: "group",
    contextLabel: "Lista · Ensaios Jazz LX",
  },
  {
    id: "cal-2",
    eventId: "mock-e2",
    title: "DJ Set ao pôr do sol",
    startsAt: iso(addDays(new Date(), 4, 18, 0)),
    endsAt: iso(addDays(new Date(), 4, 22, 0)),
    locationMode: "PHYSICAL",
    locationLabel: "Rooftop Cais · Lisboa",
    source: "direct",
    contextLabel: "Com Joana Silva",
  },
  {
    id: "cal-3",
    eventId: "mock-e4",
    title: "Open mic · novos talentos",
    startsAt: iso(addDays(new Date(), 6, 19, 30)),
    endsAt: iso(addDays(new Date(), 6, 22, 0)),
    locationMode: "PHYSICAL",
    locationLabel: "Jazz ao Largo · Faro",
    source: "mine",
    contextLabel: "O teu evento",
  },
  {
    id: "cal-4",
    eventId: "mock-e5",
    title: "Festival de verão — dia 1",
    startsAt: iso(addDays(new Date(), 11, 14, 0)),
    endsAt: iso(addDays(new Date(), 11, 23, 0)),
    locationMode: "PHYSICAL",
    locationLabel: "Arena Atlântico · Matosinhos",
    source: "group",
    contextLabel: "Lista · Booking abril",
  },
  {
    id: "cal-5",
    eventId: "mock-e3",
    title: "Jazz quartet (streaming)",
    startsAt: iso(addDays(new Date(), 5, 20, 0)),
    endsAt: iso(addDays(new Date(), 5, 21, 0)),
    locationMode: "ONLINE",
    locationLabel: null,
    source: "direct",
    contextLabel: "Com Miguel Torres",
  },
];
