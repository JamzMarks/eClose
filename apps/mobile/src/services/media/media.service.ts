import { getApiClient } from "@/services/api-client";

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
    return this.client.post<RegisteredMediaAssetDto>("/media/assets", {
      ...body,
      listable: body.listable ?? true,
    });
  }
}
