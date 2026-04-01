import { IdGenerator } from "@/shared/contracts/id-generator";

export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
