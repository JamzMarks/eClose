import { getApiClient } from "@/services/api-client";
import { USE_API_MOCKS } from "@/services/config/api-mocks";

export type RegisterVenueMediaBody = {
  parentType: "VENUE";
  parentId: string;
  kind: "IMAGE" | "DOCUMENT";
  sourceUrl: string;
  mimeType?: string;
  /** false para anexos de verificação (não aparecem na galeria pública). */
  listable?: boolean;
  caption?: string;
};

export type RegisteredMediaAssetDto = {
  id: string;
  parentType: string;
  parentId: string;
  kind: string;
  sourceUrl: string;
  mimeType: string | null;
};

export class MediaApiService {
  private readonly client = getApiClient();

  registerAsset(body: RegisterVenueMediaBody): Promise<RegisteredMediaAssetDto> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        id: `media_mock_${Date.now()}`,
        parentType: body.parentType,
        parentId: body.parentId,
        kind: body.kind,
        sourceUrl: body.sourceUrl,
        mimeType: body.mimeType ?? null,
      });
    }

    // return this.client.post<RegisteredMediaAssetDto>("/media/assets", { ...body, listable: body.listable ?? true });
    return this.client.post<RegisteredMediaAssetDto>("/media/assets", {
      ...body,
      listable: body.listable ?? true,
    });
  }
}
