import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileNamesAcknowledgedAt1740600000000 implements MigrationInterface {
  name = "ProfileNamesAcknowledgedAt1740600000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "profile_names_acknowledged_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`
      UPDATE "users"
      SET "profile_names_acknowledged_at" = NOW()
      WHERE "first_name" IS NOT NULL
        AND btrim("first_name") <> ''
        AND "last_name" IS NOT NULL
        AND btrim("last_name") <> ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "profile_names_acknowledged_at"`,
    );
  }
}
