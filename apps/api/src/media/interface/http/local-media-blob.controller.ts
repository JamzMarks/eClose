import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname, extname, join } from "path";
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import { assertSafeLocalMediaKey } from "@/media/infrastructure/object-storage/local-media-key.util";
import { getLocalMediaStorageRoot } from "@/media/infrastructure/object-storage/local-filesystem-object-storage.adapter";

type MemoryUploadedFile = { buffer: Buffer; size: number };

function guessMimeFromPath(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}

const LOCAL_UPLOAD_MAX_BYTES =
  Math.min(
    52_428_800,
    Math.max(
      1_048_576,
      parseInt(process.env.MEDIA_LOCAL_MAX_UPLOAD_BYTES ?? "52428800", 10) || 52_428_800,
    ),
  );

/**
 * Usado com {@link LocalFilesystemObjectStorageAdapter} (`MEDIA_OBJECT_STORAGE_ADAPTER=local`).
 * Upload com JWT; leitura pública por query `k` (MVP/dev).
 */
@Controller("media")
export class LocalMediaBlobController {
  @Post("local-write")
  @PrivateRoute()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: LOCAL_UPLOAD_MAX_BYTES },
    }),
  )
  async upload(
    @Query("k") k: string,
    @UploadedFile() file: MemoryUploadedFile | undefined,
  ): Promise<{ ok: true; storageKey: string; bytes: number }> {
    if (!k?.trim()) {
      throw new BadRequestException("Parâmetro k (storage key) é obrigatório.");
    }
    const storageKey = decodeURIComponent(k);
    assertSafeLocalMediaKey(storageKey);
    if (!file?.buffer?.length) {
      throw new BadRequestException("Ficheiro em falta (campo multipart `file`).");
    }

    const root = getLocalMediaStorageRoot();
    const absolutePath = join(root, storageKey);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.buffer);

    return { ok: true, storageKey, bytes: file.size };
  }

  @Get("local-public")
  read(@Query("k") k: string, @Res() res: Response): void {
    if (!k?.trim()) {
      throw new BadRequestException("Parâmetro k é obrigatório.");
    }
    const storageKey = decodeURIComponent(k);
    assertSafeLocalMediaKey(storageKey);
    const absolutePath = join(getLocalMediaStorageRoot(), storageKey);
    if (!existsSync(absolutePath)) {
      throw new NotFoundException("Ficheiro não encontrado.");
    }
    res.setHeader("Content-Type", guessMimeFromPath(absolutePath));
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(absolutePath, (err) => {
      if (err && !res.headersSent) {
        res.status(500).end();
      }
    });
  }
}
