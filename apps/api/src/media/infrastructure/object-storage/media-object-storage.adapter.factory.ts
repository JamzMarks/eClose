import type { IMediaObjectStoragePort } from "@/media/application/ports/media-object-storage.port";
import { AzureBlobSasObjectStorageAdapter } from "./azure-blob-sas-object-storage.adapter";
import { EnvPrefixObjectStorageAdapter } from "./env-prefix-object-storage.adapter";
import { LocalFilesystemObjectStorageAdapter } from "./local-filesystem-object-storage.adapter";
import { S3PresignedObjectStorageAdapter } from "./s3-presigned-object-storage.adapter";

/**
 * `MEDIA_OBJECT_STORAGE_ADAPTER`: `env` (default) | `local` | `s3` | `azure`
 */
export function createMediaObjectStorageAdapter(): IMediaObjectStoragePort {
  const mode = (process.env.MEDIA_OBJECT_STORAGE_ADAPTER ?? "env").trim().toLowerCase();
  if (mode === "s3") {
    return new S3PresignedObjectStorageAdapter();
  }
  if (mode === "azure") {
    return new AzureBlobSasObjectStorageAdapter();
  }
  if (mode === "local") {
    return new LocalFilesystemObjectStorageAdapter();
  }
  return new EnvPrefixObjectStorageAdapter();
}
