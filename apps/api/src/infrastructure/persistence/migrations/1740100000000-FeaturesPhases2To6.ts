import { MigrationInterface, QueryRunner } from "typeorm";

export class FeaturesPhases2To61740100000000 implements MigrationInterface {
  name = "FeaturesPhases2To61740100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_inquiries" ADD COLUMN "linked_event_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "notification_preferences" jsonb NOT NULL DEFAULT '{"email":true,"push":true,"sms":true}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "push_tokens" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "push_tokens"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "notification_preferences"`);
    await queryRunner.query(`ALTER TABLE "booking_inquiries" DROP COLUMN "linked_event_id"`);
  }
}
