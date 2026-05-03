import { getApiClient } from "@/services/api-client";
import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import { toQueryString } from "@/services/utils/query-string";

import type { TaxonomyKindDto, TaxonomyTermDto } from "@/contracts/taxonomy.types";

export class TaxonomyService {
  private readonly client = getApiClient();

  listByKind(kind: TaxonomyKindDto, includeInactive = false): Promise<TaxonomyTermDto[]> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve([]);
    }
    const q = toQueryString({
      kind,
      includeInactive: includeInactive ? "true" : undefined,
    });
    return this.client.get<TaxonomyTermDto[]>(`/taxonomy${q}`);
  }
}
