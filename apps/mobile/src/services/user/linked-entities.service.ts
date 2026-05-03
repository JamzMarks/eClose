import { getApiClient } from "@/services/api-client";
import type { LinkedEntitiesResponse } from "@/contracts/linked-entities.types";

export class LinkedEntitiesService {
  private readonly client = getApiClient();

  getMine(): Promise<LinkedEntitiesResponse> {
    return this.client.get<LinkedEntitiesResponse>("/users/me/linked-entities");
  }
}
