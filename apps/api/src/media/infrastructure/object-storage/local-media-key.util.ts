import { BadRequestException } from "@nestjs/common";

/** Evita path traversal; chaves vêm de `MediaService` (`media/{parentType}/{parentId}/{assetId}`). */
export function assertSafeLocalMediaKey(key: string): void {
  const k = key.trim();
  if (!k.startsWith("media/")) {
    throw new BadRequestException("Chave de armazenamento local inválida.");
  }
  if (k.includes("..") || k.includes("\\") || k.startsWith("/")) {
    throw new BadRequestException("Chave de armazenamento local inválida.");
  }
}
