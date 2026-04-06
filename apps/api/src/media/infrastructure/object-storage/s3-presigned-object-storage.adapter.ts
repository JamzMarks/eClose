import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
 * AWS S3: PUT presigned para upload directo; leitura pública via CDN/base configurada.
 */
@Injectable()
export class S3PresignedObjectStorageAdapter implements IMediaObjectStoragePort {
  private readonly client: S3Client;

  constructor() {
    const region =
      process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";
    this.client = new S3Client({ region });
  }

  async createUploadIntent(
    request: MediaObjectStorageUploadIntentRequest,
  ): Promise<MediaObjectStorageUploadIntent> {
    const bucket = process.env.MEDIA_S3_BUCKET?.trim();
    if (!bucket) {
      throw new ServiceUnavailableException("MEDIA_S3_BUCKET não configurado.");
    }
    const publicBase = (
      process.env.MEDIA_CDN_PUBLIC_BASE_URL ??
      process.env.CDN_PUBLIC_URL ??
      ""
    ).replace(/\/$/, "");
    if (!publicBase) {
      throw new ServiceUnavailableException(
        "MEDIA_CDN_PUBLIC_BASE_URL (ou CDN_PUBLIC_URL) é necessário para a URL pública do asset.",
      );
    }

    const contentType = request.expectedMimeType ?? "application/octet-stream";
    const expiresIn = Math.min(
      604800,
      Math.max(60, request.expiresInSeconds ?? 3600),
    );

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: request.storageKey,
      ContentType: contentType,
    });

    const uploadTargetUrl = await getSignedUrl(this.client, command, {
      expiresIn,
    });

    return {
      storageKey: request.storageKey,
      uploadTargetUrl,
      httpMethod: "PUT",
      publicReadUrl: `${publicBase}/${request.storageKey}`,
      uploadHeaders: {
        "Content-Type": contentType,
      },
    };
  }
}
