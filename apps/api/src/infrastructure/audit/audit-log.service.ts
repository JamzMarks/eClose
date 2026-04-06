import { createHash } from "crypto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { AuditLogOrmEntity } from "@/infrastructure/audit/audit-log.orm-entity";

export type AuditLogActorType = "user" | "admin_api_key" | "system";

export type RecordAuditLogInput = {
  actorType: AuditLogActorType;
  actorId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  payload?: Record<string, unknown> | null;
};

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly repo: Repository<AuditLogOrmEntity>,
    @Inject(ID_GENERATOR)
    private readonly ids: IdGenerator,
  ) {}

  async record(input: RecordAuditLogInput): Promise<void> {
    const row = new AuditLogOrmEntity();
    row.id = this.ids.generate();
    row.actorType = input.actorType;
    row.actorId = input.actorId ?? null;
    row.action = input.action;
    row.resourceType = input.resourceType;
    row.resourceId = input.resourceId;
    row.payload = input.payload ?? null;
    row.payloadHash =
      input.payload == null
        ? null
        : createHash("sha256")
            .update(JSON.stringify(input.payload), "utf8")
            .digest("hex");
    await this.repo.save(row);
  }
}
