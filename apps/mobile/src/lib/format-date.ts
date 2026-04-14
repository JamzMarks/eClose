export function formatEventRange(
  startsAt: string,
  endsAt: string,
  locale = "pt-PT",
): string {
  try {
    const s = new Date(startsAt);
    const e = new Date(endsAt);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return startsAt;
    }
    const datePart = s.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const startT = s.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endT = e.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} · ${startT} – ${endT}`;
  } catch {
    return startsAt;
  }
}

/** Uma linha curta para filas de calendário (dia + hora de início). */
export function formatMyCalendarCompactLine(startsAt: string, locale = "pt-PT"): string {
  try {
    const s = new Date(startsAt);
    if (Number.isNaN(s.getTime())) return startsAt;
    const datePart = s.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const timePart = s.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    return `${datePart} · ${timePart}`;
  } catch {
    return startsAt;
  }
}

/** Hora curta na lista de chats (hoje), “ontem”, ou data. */
export function formatChatListTime(
  iso: string,
  yesterdayLabel: string,
  locale = "pt-PT",
): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round(
      (startOfToday.getTime() - startOfMsg.getTime()) / 86_400_000,
    );
    if (diffDays === 0) {
      return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) {
      return yesterdayLabel;
    }
    return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}
