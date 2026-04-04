import { v7 as uuidv7 } from "uuid";
import { IdGenerator } from "@/shared/contracts/id-generator";

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return uuidv7();
  }
}