import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
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
 * Azure Blob Storage: SAS para upload (create + write) ao blob; leitura pública via CDN/base.
 */
@Injectable()
export class AzureBlobSasObjectStorageAdapter implements IMediaObjectStoragePort {
  async createUploadIntent(
    request: MediaObjectStorageUploadIntentRequest,
  ): Promise<MediaObjectStorageUploadIntent> {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME?.trim();
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY?.trim();
    const containerName = process.env.MEDIA_AZURE_CONTAINER?.trim();
    if (!accountName || !accountKey || !containerName) {
      throw new ServiceUnavailableException(
        "Configure AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY e MEDIA_AZURE_CONTAINER.",
      );
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

    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    const serviceUrl = `https://${accountName}.blob.core.windows.net`;
    const serviceClient = new BlobServiceClient(serviceUrl, credential);
    const containerClient = serviceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(request.storageKey);

    const expiresIn = Math.min(
      604800,
      Math.max(60, request.expiresInSeconds ?? 3600),
    );
    const startsOn = new Date(Date.now() - 60_000);
    const expiresOn = new Date(Date.now() + expiresIn * 1000);

    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: request.storageKey,
        permissions: BlobSASPermissions.parse("cw"),
        startsOn,
        expiresOn,
        protocol: SASProtocol.Https,
        contentType: request.expectedMimeType ?? undefined,
      },
      credential,
    ).toString();

    const uploadTargetUrl = `${blobClient.url}?${sas}`;
    const contentType = request.expectedMimeType ?? "application/octet-stream";

    return {
      storageKey: request.storageKey,
      uploadTargetUrl,
      httpMethod: "PUT",
      publicReadUrl: `${publicBase}/${request.storageKey}`,
      uploadHeaders: {
        "Content-Type": contentType,
        "x-ms-blob-type": "BlockBlob",
      },
    };
  }
}
