export enum EventLocationMode {
  /**
   * Presencial: pode estar atrelado a um Venue (catálogo) ou ser totalmente informal
   * (rótulo, notas, endereço ad-hoc) — ex.: “Meu aniversário”.
   */
  PHYSICAL = "PHYSICAL",
  /** 100% online (streaming, meet, etc.) — sem venue */
  ONLINE = "ONLINE",
  /**
   * Presencial + link online: venue opcional; público vê transmissão e/ou ponto físico informal.
   */
  HYBRID = "HYBRID",
}
