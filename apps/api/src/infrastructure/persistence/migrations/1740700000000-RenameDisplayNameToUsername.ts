import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDisplayNameToUsername1740700000000 implements MigrationInterface {
  name = "RenameDisplayNameToUsername1740700000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "display_name" TO "username"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "username" TO "display_name"`,
    );
  }
}
