import { MigrationInterface, QueryRunner } from "typeorm";

export class UserBlocks1740400000000 implements MigrationInterface {
  name = "UserBlocks1740400000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_blocks" (
        "id" uuid NOT NULL,
        "blocker_user_id" uuid NOT NULL,
        "blocked_user_id" uuid NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_blocks" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_blocks_pair" UNIQUE ("blocker_user_id", "blocked_user_id"),
        CONSTRAINT "FK_user_blocks_blocker" FOREIGN KEY ("blocker_user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_blocks_blocked" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_user_blocks_blocker" ON "user_blocks" ("blocker_user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_blocks_blocker"`);
    await queryRunner.query(`DROP TABLE "user_blocks"`);
  }
}
