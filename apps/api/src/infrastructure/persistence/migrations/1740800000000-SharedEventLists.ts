import { MigrationInterface, QueryRunner } from "typeorm";

export class SharedEventLists1740800000000 implements MigrationInterface {
  name = "SharedEventLists1740800000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "shared_event_lists" (
        "id" uuid NOT NULL,
        "owner_user_id" uuid NOT NULL,
        "title" character varying(200) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shared_event_lists" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sel_owner" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "shared_event_list_members" (
        "list_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" character varying(32) NOT NULL,
        CONSTRAINT "PK_shared_event_list_members" PRIMARY KEY ("list_id", "user_id"),
        CONSTRAINT "FK_selm_list" FOREIGN KEY ("list_id") REFERENCES "shared_event_lists"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_selm_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "shared_event_list_items" (
        "id" uuid NOT NULL,
        "list_id" uuid NOT NULL,
        "event_id" uuid NOT NULL,
        "added_by_user_id" uuid NOT NULL,
        "added_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shared_event_list_items" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_sel_item_list_event" UNIQUE ("list_id", "event_id"),
        CONSTRAINT "FK_seli_list" FOREIGN KEY ("list_id") REFERENCES "shared_event_lists"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_seli_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_seli_added_by" FOREIGN KEY ("added_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shared_event_list_items"`);
    await queryRunner.query(`DROP TABLE "shared_event_list_members"`);
    await queryRunner.query(`DROP TABLE "shared_event_lists"`);
  }
}
