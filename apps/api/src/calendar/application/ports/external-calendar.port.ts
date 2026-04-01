/**
 * Integração futura (Google Calendar, Microsoft Graph, etc.) sem acoplar Nest aos SDKs aqui.
 */
export interface ExternalCalendarPort {
  listBusyWindows(input: {
    ownerExternalRef: string;
    from: Date;
    to: Date;
  }): Promise<Array<{ start: Date; end: Date }>>;
}

export const EXTERNAL_CALENDAR_PORT = Symbol("EXTERNAL_CALENDAR_PORT");
