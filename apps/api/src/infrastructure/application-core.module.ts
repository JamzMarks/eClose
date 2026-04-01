import { Global, Module } from "@nestjs/common";
import { ID_GENERATOR } from "@/shared/contracts/id-generator";
import { UuidIdGenerator } from "@/shared/infrastructure/uuid-id-generator.adapter";

@Global()
@Module({
  providers: [{ provide: ID_GENERATOR, useClass: UuidIdGenerator }],
  exports: [ID_GENERATOR],
})
export class ApplicationCoreModule {}
