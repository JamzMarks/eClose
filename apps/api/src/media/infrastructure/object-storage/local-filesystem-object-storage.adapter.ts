import { Injectable } from "@nestjs/common";
import { join } from "path";
import type {
  IMediaObjectStoragePort,
  MediaObjectStorageUploadIntent,
  MediaObjectStorageUploadIntentRequest,
} from "@/media/application/ports/media-object-storage.port";

/**
 * Disco local + endpoints na própria API (`POST /media/local-write`, `GET /media/local-public`).
 * Ideal para testes e MVP sem S3/Azure — define `MEDIA_OBJECT_STORAGE_ADAPTER=local`.
 */
@Injectable()
export class LocalFilesystemObjectStorageAdapter implements IMediaObjectStoragePort {
  async createUploadIntent(
    request: MediaObjectStorageUploadIntentRequest,
  ): Promise<MediaObjectStorageUploadIntent> {
    const port = process.env.PORT ?? "3000";
    const appBase = (
      process.env.MEDIA_PUBLIC_APP_URL ?? `http://127.0.0.1:${port}`
    ).replace(/\/$/, "");
    const q = `k=${encodeURIComponent(request.storageKey)}`;
    return {
      storageKey: request.storageKey,
      uploadTargetUrl: `${appBase}/media/local-write?${q}`,
      httpMethod: "POST",
      publicReadUrl: `${appBase}/media/local-public?${q}`,
      multipartFieldName: "file",
    };
  }
}

/** Raiz no disco onde os blobs locais são gravados. */
export function getLocalMediaStorageRoot(): string {
  const raw = process.env.MEDIA_LOCAL_ROOT?.trim();
  if (raw) return raw;
  return join(process.cwd(), "var", "local-media");
}
