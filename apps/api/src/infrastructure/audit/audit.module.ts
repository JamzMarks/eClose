import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogOrmEntity } from "@/infrastructure/audit/audit-log.orm-entity";
import { AuditLogService } from "@/infrastructure/audit/audit-log.service";
import { AUDIT_LOG_SERVICE } from "@/infrastructure/audit/audit.tokens";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity])],
  providers: [{ provide: AUDIT_LOG_SERVICE, useClass: AuditLogService }],
  exports: [AUDIT_LOG_SERVICE],
})
export class AuditModule {}
