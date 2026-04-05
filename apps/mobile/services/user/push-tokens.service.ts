import { getApiClient } from "@/services/api-client";

export class PushTokensService {
  private readonly client = getApiClient();

  getMine(): Promise<string[]> {
    return this.client.get<string[]>("/users/me/push-tokens");
  }

  patchMine(pushTokens: string[]): Promise<string[]> {
    return this.client.patch<string[]>("/users/me/push-tokens", { pushTokens });
  }
}
