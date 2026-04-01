/** 0 = domingo … 6 = sábado (alinhado a Date.getUTCDay / getDay em timezone local do venue) */
export type VenueOpeningSlot = {
  weekday: number;
  openLocal: string;
  closeLocal: string;
  /** true se closeLocal é no dia seguinte (ex.: 22:00–03:00) */
  closesNextDay?: boolean;
};
