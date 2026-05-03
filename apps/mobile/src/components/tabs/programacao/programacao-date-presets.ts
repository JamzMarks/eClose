/** Presets de intervalo local (ISO) para filtros de listagem de eventos. */

import type { DiscoverEventListFilters } from "@/types/entities/discover.types";

export type ProgramacaoTimeQuickId = "all" | "today" | "weekend" | "online" | "more";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Início do dia local em ISO UTC (via Date local → ISO). */
export function localDayStartISO(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  return x.toISOString();
}

/** Fim do dia local em ISO. */
export function localDayEndISO(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return x.toISOString();
}

export function localTodayRangeISO(now = new Date()): { from: string; to: string } {
  return { from: localDayStartISO(now), to: localDayEndISO(now) };
}

/**
 * Sábado 00:00 — domingo 23:59:59 local da semana corrente de `now`
 * (se for segunda–sexta, o fim‑de‑semana à frente; sábado/domingo, o atual).
 */
export function localWeekendRangeISO(now = new Date()): { from: string; to: string } {
  const day = now.getDay();
  const sat = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (day === 0) {
    sat.setDate(sat.getDate() - 1);
  } else if (day !== 6) {
    sat.setDate(sat.getDate() + (6 - day));
  }
  sat.setHours(0, 0, 0, 0);
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  sun.setHours(23, 59, 59, 999);
  return { from: sat.toISOString(), to: sun.toISOString() };
}

/** `YYYY-MM-DD` → início do dia local; vazio → null. */
export function parseLocalDateInputStart(isoDate: string): string | null {
  const t = isoDate.trim();
  if (!t) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const d = new Date(y, mo, da, 0, 0, 0, 0);
  if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da) return null;
  return d.toISOString();
}

export function parseLocalDateInputEnd(isoDate: string): string | null {
  const t = isoDate.trim();
  if (!t) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const d = new Date(y, mo, da, 23, 59, 59, 999);
  if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da) return null;
  return d.toISOString();
}

/** ISO instant → `YYYY-MM-DD` no calendário local (para inputs da folha). */
export function formatLocalDateInputFromISO(iso: string): string {
  if (!iso.trim()) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Estado visual dos chips (sem `more`). `unset` = filtros à mão na folha, etc. */
export type ProgramacaoTimeQuickSelection = "all" | "today" | "weekend" | "online" | "unset";

export function inferProgramacaoTimeQuickId(f: {
  from: string;
  to: string;
  locationMode: string;
}): ProgramacaoTimeQuickSelection {
  if (f.locationMode === "ONLINE" && !f.from?.trim() && !f.to?.trim()) {
    return "online";
  }
  const today = localTodayRangeISO();
  if (f.locationMode === "ALL" && f.from === today.from && f.to === today.to) return "today";
  const weekend = localWeekendRangeISO();
  if (f.locationMode === "ALL" && f.from === weekend.from && f.to === weekend.to) return "weekend";
  if (!f.from?.trim() && !f.to?.trim() && f.locationMode === "ALL") return "all";
  return "unset";
}

/** Aplica um atalho temporal mantendo cidade e texto de pesquisa. */
export function eventFiltersForTimeQuick(
  id: ProgramacaoTimeQuickId,
  prev: DiscoverEventListFilters,
): DiscoverEventListFilters {
  if (id === "more") return prev;
  const keep = { city: prev.city, query: prev.query };
  if (id === "all") {
    return { ...prev, ...keep, locationMode: "ALL", from: "", to: "" };
  }
  if (id === "online") {
    return { ...prev, ...keep, locationMode: "ONLINE", from: "", to: "" };
  }
  if (id === "today") {
    const r = localTodayRangeISO();
    return { ...prev, ...keep, locationMode: "ALL", from: r.from, to: r.to };
  }
  if (id === "weekend") {
    const r = localWeekendRangeISO();
    return { ...prev, ...keep, locationMode: "ALL", from: r.from, to: r.to };
  }
  return prev;
}
