import { getApiClient } from "@/services/api-client";

import type {
  SharedEventListDetailDto,
  SharedEventListSummaryDto,
  SharedListEventRowDto,
} from "./shared-event-list.types";

export class SharedEventListService {
  private readonly client = getApiClient();

  listMine(): Promise<SharedEventListSummaryDto[]> {
    return this.client.get<SharedEventListSummaryDto[]>("/shared-event-lists");
  }

  create(title: string): Promise<SharedEventListSummaryDto> {
    return this.client.post<SharedEventListSummaryDto>("/shared-event-lists", { title });
  }

  getDetail(listId: string): Promise<SharedEventListDetailDto> {
    return this.client.get<SharedEventListDetailDto>(
      `/shared-event-lists/${encodeURIComponent(listId)}`,
    );
  }

  updateTitle(listId: string, title: string): Promise<SharedEventListSummaryDto> {
    return this.client.patch<SharedEventListSummaryDto>(
      `/shared-event-lists/${encodeURIComponent(listId)}`,
      { title },
    );
  }

  deleteList(listId: string): Promise<void> {
    return this.client.delete<void>(`/shared-event-lists/${encodeURIComponent(listId)}`);
  }

  listEvents(listId: string): Promise<SharedListEventRowDto[]> {
    return this.client.get<SharedListEventRowDto[]>(
      `/shared-event-lists/${encodeURIComponent(listId)}/events`,
    );
  }

  addEvent(listId: string, eventId: string): Promise<unknown> {
    return this.client.post(
      `/shared-event-lists/${encodeURIComponent(listId)}/events`,
      { eventId },
    );
  }

  removeEvent(listId: string, eventId: string): Promise<void> {
    return this.client.delete<void>(
      `/shared-event-lists/${encodeURIComponent(listId)}/events/${encodeURIComponent(eventId)}`,
    );
  }

  addMember(
    listId: string,
    userId: string,
    role: "EDITOR" | "VIEWER",
  ): Promise<unknown> {
    return this.client.post(
      `/shared-event-lists/${encodeURIComponent(listId)}/members`,
      { userId, role },
    );
  }

  removeMember(listId: string, memberUserId: string): Promise<void> {
    return this.client.delete<void>(
      `/shared-event-lists/${encodeURIComponent(listId)}/members/${encodeURIComponent(memberUserId)}`,
    );
  }
}
