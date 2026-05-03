import { getApiClient } from "@/services/api-client";
import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import { localRegisteredMediaAsset } from "@/services/media/media.local-data";
import type {
  RegisterMediaAssetBody,
  RegisteredMediaAssetDto,
  RequestUploadIntentBody,
  SignedUploadIntentResult,
} from "@/contracts/media.types";

/** @deprecated Use `RegisterMediaAssetBody` com `parentType: "VENUE"`. */
export type RegisterVenueMediaBody = Extract<RegisterMediaAssetBody, { parentType: "VENUE" }>;

export type { RegisteredMediaAssetDto, SignedUploadIntentResult } from "@/contracts/media.types";

/**
 * Completa o upload para o destino assinado (PUT multipart ou POST conforme `intent`).
 * Em React Native, `localUri` é tipicamente `file://...` ou `content://...`.
 */
export async function uploadLocalFileWithIntent(
  intent: SignedUploadIntentResult,
  localUri: string,
  mimeType: string,
): Promise<void> {
  if (intent.multipartFieldName) {
    const form = new FormData();
    form.append(intent.multipartFieldName, {
      uri: localUri,
      name: "upload",
      type: mimeType,
    } as unknown as Blob);
    if (intent.fields) {
      for (const [k, v] of Object.entries(intent.fields)) {
        form.append(k, v);
      }
    }
    const headers: Record<string, string> = { ...intent.headers };
    const res = await fetch(intent.uploadUrl, {
      method: intent.httpMethod ?? "POST",
      headers,
      body: form,
    });
    if (!res.ok) {
      throw new Error(`Upload falhou (${res.status})`);
    }
    return;
  }

  const method = intent.httpMethod ?? "PUT";
  const fileRes = await fetch(localUri);
  const blob = await fileRes.blob();
  const headers: Record<string, string> = {
    ...intent.headers,
    ...(method === "PUT" ? { "Content-Type": mimeType } : {}),
  };
  const res = await fetch(intent.uploadUrl, { method, headers, body: blob });
  if (!res.ok) {
    throw new Error(`Upload falhou (${res.status})`);
  }
}

export class MediaApiService {
  private readonly client = getApiClient();

  requestUploadIntent(body: RequestUploadIntentBody): Promise<SignedUploadIntentResult> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve({
        assetId: `intent_local_${Date.now()}`,
        storageKey: `local/${body.parentType}/${body.parentId}`,
        uploadUrl: "https://example.invalid/upload",
        publicUrl: body.kind === "IMAGE" ? "https://example.invalid/image.jpg" : "https://example.invalid/doc.pdf",
        httpMethod: "PUT",
      });
    }
    return this.client.post<SignedUploadIntentResult>("/media/upload-intent", body);
  }

  registerAsset(body: RegisterMediaAssetBody): Promise<RegisteredMediaAssetDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      const kind: "IMAGE" | "DOCUMENT" =
        body.kind === "DOCUMENT" ? "DOCUMENT" : "IMAGE";
      return Promise.resolve(
        localRegisteredMediaAsset({
          parentType: body.parentType,
          parentId: body.parentId,
          kind,
          sourceUrl: body.sourceUrl,
          mimeType: body.mimeType,
          listable: body.listable,
        }),
      );
    }
    return this.client.post<RegisteredMediaAssetDto>("/media/assets", {
      ...body,
      listable: body.listable ?? true,
    });
  }

  /**
   * Pedido de intent + upload do ficheiro + registo na API.
   * @returns asset registado (id pode diferir do `intent.assetId` conforme implementação do servidor).
   */
  async uploadAndRegisterImage(params: {
    parentType: RegisterMediaAssetBody["parentType"];
    parentId: string;
    localUri: string;
    mimeType: string;
    listable?: boolean;
    setAsPrimary?: boolean;
    caption?: string;
  }): Promise<RegisteredMediaAssetDto> {
    const intent = await this.requestUploadIntent({
      parentType: params.parentType,
      parentId: params.parentId,
      kind: "IMAGE",
      expectedMimeType: params.mimeType,
      caption: params.caption,
    });
    await uploadLocalFileWithIntent(intent, params.localUri, params.mimeType);
    return this.registerAsset({
      parentType: params.parentType,
      parentId: params.parentId,
      kind: "IMAGE",
      sourceUrl: intent.publicUrl,
      mimeType: params.mimeType,
      storageKey: intent.storageKey,
      listable: params.listable ?? true,
      setAsPrimary: params.setAsPrimary,
      caption: params.caption,
    });
  }

  setAssetPrimary(mediaAssetId: string): Promise<RegisteredMediaAssetDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve({
        id: mediaAssetId,
        parentType: "VENUE",
        parentId: "local",
        kind: "IMAGE",
        sourceUrl: "https://example.invalid",
        mimeType: "image/jpeg",
      });
    }
    return this.client.patch<RegisteredMediaAssetDto>(
      `/media/assets/${encodeURIComponent(mediaAssetId)}/primary`,
      {},
    );
  }
}
