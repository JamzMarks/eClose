import type { MyCalendarFilterId, MyCalendarSavedEvent } from "@/types/entities/my-calendar.types";

/** Filtra só por origem (inclui passados — útil para o calendário mensal). */
export function applySourceFilter(
  events: MyCalendarSavedEvent[],
  filter: MyCalendarFilterId,
): MyCalendarSavedEvent[] {
  if (filter === "all") return [...events];
  return events.filter((e) => e.source === filter);
}

/** Eventos futuros (ou a decorrer), ordenados por data de início. */
export function filterAndSortUpcoming(
  events: MyCalendarSavedEvent[],
  filter: MyCalendarFilterId,
): MyCalendarSavedEvent[] {
  const threshold = Date.now() - 120_000;
  let rows = applySourceFilter(events, filter).filter(
    (e) => new Date(e.startsAt).getTime() >= threshold,
  );
  rows.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return rows;
}

export function nextUpcoming(events: MyCalendarSavedEvent[], n: number): MyCalendarSavedEvent[] {
  return filterAndSortUpcoming(events, "all").slice(0, n);
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isTodayLocal(d: Date): boolean {
  return isSameLocalDay(d, new Date());
}

/** Eventos cujo início cai no dia local indicado. */
export function eventsOnLocalDay(
  events: MyCalendarSavedEvent[],
  day: Date,
): MyCalendarSavedEvent[] {
  return events
    .filter((e) => isSameLocalDay(new Date(e.startsAt), day))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

/** Eventos com início em qualquer um dos dias locais (chaves `localDayKey`). */
export function eventsOnLocalDayKeys(
  events: MyCalendarSavedEvent[],
  keys: Iterable<string>,
): MyCalendarSavedEvent[] {
  const set = new Set(keys);
  return events
    .filter((e) => set.has(localDayKey(new Date(e.startsAt))))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

/** Todos os eventos do mês local (início dentro de `year`/`month`). */
export function eventsInLocalMonth(
  events: MyCalendarSavedEvent[],
  year: number,
  month: number,
): MyCalendarSavedEvent[] {
  return events
    .filter((e) => {
      const d = new Date(e.startsAt);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export type CalendarCell = { kind: "pad" } | { kind: "day"; date: Date };

/** Grelha do mês: `weekStartsOn` 0 = domingo, 1 = segunda. */
export function buildMonthGrid(year: number, month: number, weekStartsOn: 0 | 1 = 1): CalendarCell[] {
  const first = new Date(year, month, 1);
  const pad = (first.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < pad; i++) cells.push({ kind: "pad" });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ kind: "day", date: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "pad" });
  return cells;
}

/** Contagem de eventos por dia local (chave YYYY-M-D). */
export function eventCountByLocalDayKey(
  events: MyCalendarSavedEvent[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of events) {
    const d = new Date(e.startsAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Interpreta chave `localDayKey` (mês 0–11). Devolve `null` se inválida.
 */
export function parseLocalDayKey(key: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(key.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if ([year, month, day].some((n) => Number.isNaN(n))) return null;
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  const probe = new Date(year, month, day);
  if (
    probe.getFullYear() !== year ||
    probe.getMonth() !== month ||
    probe.getDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/** `count` dias consecutivos no calendário local, o primeiro é “hoje” (meia-noite local). */
export function rollingLocalDaysFromToday(count = 7): Date[] {
  const n = new Date();
  const start = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const days: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export function dateFromLocalDayKey(key: string): Date | null {
  const parsed = parseLocalDayKey(key);
  if (!parsed) return null;
  return new Date(parsed.year, parsed.month, parsed.day);
}
