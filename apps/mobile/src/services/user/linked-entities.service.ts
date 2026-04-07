import { getApiClient } from "@/services/api-client";
import type { LinkedEntitiesResponse } from "@/services/types/linked-entities.types";

export class LinkedEntitiesService {
  private readonly client = getApiClient();

  getMine(): Promise<LinkedEntitiesResponse> {
    return this.client.get<LinkedEntitiesResponse>("/users/me/linked-entities");
  }
}
