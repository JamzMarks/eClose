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
