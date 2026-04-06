import {
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import type {
  IMediaObjectStoragePort,
  MediaObjectStorageUploadIntent,
  MediaObjectStorageUploadIntentRequest,
} from "@/media/application/ports/media-object-storage.port";

/**
 * MVP / dev: URLs derivadas de prefixos em env (sem SDK).
 * Comportamento legado: `MEDIA_UPLOAD_BASE_URL` + key, público em `MEDIA_CDN_PUBLIC_BASE_URL`.
 */
@Injectable()
export class EnvPrefixObjectStorageAdapter implements IMediaObjectStoragePort {
  async createUploadIntent(
    request: MediaObjectStorageUploadIntentRequest,
  ): Promise<MediaObjectStorageUploadIntent> {
    const cdn = (
      process.env.MEDIA_CDN_PUBLIC_BASE_URL ??
      process.env.CDN_PUBLIC_URL ??
      ""
    ).replace(/\/$/, "");
    const uploadBase = (process.env.MEDIA_UPLOAD_BASE_URL ?? "").replace(/\/$/, "");
    if (!cdn || !uploadBase) {
      throw new ServiceUnavailableException(
        "Configure MEDIA_CDN_PUBLIC_BASE_URL (ou CDN_PUBLIC_URL) e MEDIA_UPLOAD_BASE_URL, ou use MEDIA_OBJECT_STORAGE_ADAPTER=local|s3|azure.",
      );
    }
    const contentType = request.expectedMimeType ?? "application/octet-stream";
    return {
      storageKey: request.storageKey,
      uploadTargetUrl: `${uploadBase}/${request.storageKey}`,
      httpMethod: "PUT",
      publicReadUrl: `${cdn}/${request.storageKey}`,
      formFields: {
        "Content-Type": contentType,
      },
    };
  }
}
