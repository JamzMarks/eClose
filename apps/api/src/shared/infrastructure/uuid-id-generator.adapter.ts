import { v7 as uuidv7 } from "uuid";
import { IdGenerator } from "@/shared/contracts/id-generator";

/** UUID v7 — ordenável por tempo (timestamp no prefixo), útil para chaves e índices. */
export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return uuidv7();
  }
}
