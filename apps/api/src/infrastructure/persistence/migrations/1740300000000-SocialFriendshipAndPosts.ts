import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialFriendshipAndPosts1740300000000 implements MigrationInterface {
  name = "SocialFriendshipAndPosts1740300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "friend_requests" (
        "id" uuid NOT NULL,
        "requester_id" uuid NOT NULL,
        "addressee_id" uuid NOT NULL,
        "status" varchar(24) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_friend_requests" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_friend_requests_pair" UNIQUE ("requester_id", "addressee_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_friend_requests_addressee_status" ON "friend_requests" ("addressee_id", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_friend_requests_requester_status" ON "friend_requests" ("requester_id", "status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL,
        "author_user_id" uuid NOT NULL,
        "scope_type" varchar(32) NOT NULL,
        "scope_id" uuid,
        "body" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_posts_scope_created" ON "posts" ("scope_type", "scope_id", "created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_posts_scope_created"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_friend_requests_requester_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_friend_requests_addressee_status"`);
    await queryRunner.query(`DROP TABLE "friend_requests"`);
  }
}
