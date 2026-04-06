import { MigrationInterface, QueryRunner } from "typeorm";

export class LegalConsentVenueTrustEvidenceAudit1741000000000 implements MigrationInterface {
  name = "LegalConsentVenueTrustEvidenceAudit1741000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "terms_version" character varying(64)
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "privacy_version" character varying(64)
    `);

    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "registry_snapshot_hash" character varying(64)
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "registry_checked_at" TIMESTAMPTZ
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "verification_rejection_reason" text
    `);

    await queryRunner.query(`
      CREATE TABLE "venue_verification_history" (
        "id" uuid NOT NULL,
        "venue_id" uuid NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "event_kind" character varying(32) NOT NULL,
        "from_status" character varying(32) NOT NULL,
        "to_status" character varying(32) NOT NULL,
        "registry_snapshot_hash" character varying(64),
        "rejection_reason" text,
        CONSTRAINT "PK_venue_verification_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_venue_verification_history_venue" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_venue_verification_history_venue_id" ON "venue_verification_history" ("venue_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_log" (
        "id" uuid NOT NULL,
        "actor_type" character varying(32) NOT NULL,
        "actor_id" uuid,
        "action" character varying(128) NOT NULL,
        "resource_type" character varying(64) NOT NULL,
        "resource_id" character varying(64) NOT NULL,
        "payload" jsonb,
        "payload_hash" character varying(64),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_log" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_log_resource" ON "audit_log" ("resource_type", "resource_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_log_created_at" ON "audit_log" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_log"`);
    await queryRunner.query(`DROP TABLE "venue_verification_history"`);

    await queryRunner.query(`
      ALTER TABLE "venues" DROP COLUMN "verification_rejection_reason"
    `);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "registry_checked_at"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "registry_snapshot_hash"`);

    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "privacy_version"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "terms_version"`);
  }
}
