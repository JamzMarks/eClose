import { Injectable } from "@nestjs/common";
import { ExternalCalendarPort } from "../application/ports/external-calendar.port";

@Injectable()
export class NoopExternalCalendarAdapter implements ExternalCalendarPort {
  async listBusyWindows(): Promise<Array<{ start: Date; end: Date }>> {
    return [];
  }
}
