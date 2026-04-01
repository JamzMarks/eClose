import { IdGenerator } from "@/shared/contracts/id-generator";

export class UuidGenerator implements IdGenerator {
    generate(): string {
      return crypto.randomUUID();
    }
}