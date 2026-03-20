import { IdGenerator } from "@/shared/domain/interfaces/id-generator.interface";

export class UuidGenerator implements IdGenerator {
    generate(): string {
      return crypto.randomUUID();
    }
}