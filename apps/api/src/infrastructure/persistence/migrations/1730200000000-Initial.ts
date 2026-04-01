import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730200000000 implements MigrationInterface {
  name = "Initial1730200000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "email" character varying(320),
        "phone" character varying(64),
        "password_hash" character varying(255),
        "display_name" character varying(255),
        "handle" character varying(64),
        "birth_date" TIMESTAMP WITH TIME ZONE,
        "country_code" character varying(2),
        "locale" character varying(32),
        "avatar_url" text,
        "bio" text,
        "event_interests" jsonb NOT NULL DEFAULT '[]',
        "email_verified_at" TIMESTAMP WITH TIME ZONE,
        "phone_verified_at" TIMESTAMP WITH TIME ZONE,
        "terms_accepted_at" TIMESTAMP WITH TIME ZONE,
        "privacy_accepted_at" TIMESTAMP WITH TIME ZONE,
        "marketing_opt_in" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email") WHERE "email" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_phone" ON "users" ("phone") WHERE "phone" IS NOT NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_handle" ON "users" ("handle") WHERE "handle" IS NOT NULL`);

    await queryRunner.query(`
      CREATE TABLE "oauth_accounts" (
        "id" uuid NOT NULL,
        "provider" character varying(32) NOT NULL,
        "provider_account_id" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_oauth_accounts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_oauth_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_oauth_provider_account" UNIQUE ("provider", "provider_account_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL,
        "token" character varying(512) NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "taxonomy_terms" (
        "id" uuid NOT NULL,
        "kind" character varying(64) NOT NULL,
        "slug" character varying(128) NOT NULL,
        "label" character varying(255) NOT NULL,
        "parent_id" uuid,
        "synonyms" jsonb NOT NULL DEFAULT '[]',
        "facet_metadata" jsonb NOT NULL DEFAULT '{}',
        "active" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_taxonomy_terms" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_taxonomy_kind_slug" UNIQUE ("kind", "slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "artists" (
        "id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "type" character varying(32) NOT NULL,
        "owner_id" uuid NOT NULL,
        "headline" text,
        "bio" text,
        "website_url" text,
        "marketplace_visible" boolean NOT NULL DEFAULT false,
        "open_to_venue_bookings" boolean NOT NULL DEFAULT false,
        "taxonomy_term_ids" jsonb NOT NULL DEFAULT '[]',
        "primary_media_asset_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_artists" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_artists_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "venues" (
        "id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text,
        "owner_user_id" uuid,
        "address" jsonb NOT NULL,
        "geo_lat" double precision,
        "geo_lng" double precision,
        "timezone" character varying(64) NOT NULL,
        "opening_hours" jsonb NOT NULL DEFAULT '[]',
        "taxonomy_term_ids" jsonb NOT NULL DEFAULT '[]',
        "marketplace_listed" boolean NOT NULL DEFAULT false,
        "open_to_artist_inquiries" boolean NOT NULL DEFAULT false,
        "primary_media_asset_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venues" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_venues_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL,
        "title" character varying(500) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text,
        "location_mode" character varying(32) NOT NULL,
        "venue_id" uuid,
        "online_url" text,
        "location_label" character varying(500),
        "location_notes" text,
        "adhoc_address" jsonb,
        "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "timezone" character varying(64) NOT NULL,
        "organizer_artist_id" uuid NOT NULL,
        "taxonomy_term_ids" jsonb NOT NULL DEFAULT '[]',
        "primary_media_asset_id" uuid,
        "status" character varying(32) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_events_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "media_assets" (
        "id" uuid NOT NULL,
        "parent_type" character varying(32) NOT NULL,
        "parent_id" uuid NOT NULL,
        "kind" character varying(32) NOT NULL,
        "source_url" text NOT NULL,
        "storage_key" text,
        "thumbnail_url" text,
        "cdn_url" text,
        "processing_status" character varying(32) NOT NULL DEFAULT 'READY',
        "mime_type" character varying(128),
        "width" integer,
        "height" integer,
        "duration_seconds" double precision,
        "caption" text,
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_primary" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media_assets" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_media_parent" ON "media_assets" ("parent_type", "parent_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "chat_conversations" (
        "id" uuid NOT NULL,
        "kind" character varying(16) NOT NULL,
        "participant_refs" jsonb NOT NULL,
        "title" character varying(500),
        "direct_pair_key" character varying(512),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_conversations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_chat_direct_pair" UNIQUE ("direct_pair_key")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat_messages" (
        "id" uuid NOT NULL,
        "conversation_id" uuid NOT NULL,
        "author_ref" jsonb NOT NULL,
        "body" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_messages_conv_created" ON "chat_messages" ("conversation_id", "created_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "type" character varying(64) NOT NULL,
        "channel" character varying(32) NOT NULL,
        "template_id" character varying(128),
        "template_version" character varying(32),
        "payload" jsonb NOT NULL DEFAULT '{}',
        "status" character varying(32) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "sent_at" TIMESTAMP WITH TIME ZONE,
        "delivered_at" TIMESTAMP WITH TIME ZONE,
        "external_id" character varying(255),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "artist_unavailabilities" (
        "id" uuid NOT NULL,
        "artist_id" uuid NOT NULL,
        "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "reason" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_artist_unavailabilities" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_artist_unavail_range" ON "artist_unavailabilities" ("artist_id", "starts_at", "ends_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "venue_unavailabilities" (
        "id" uuid NOT NULL,
        "venue_id" uuid NOT NULL,
        "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "reason" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venue_unavail" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_venue_unavail_range" ON "venue_unavailabilities" ("venue_id", "starts_at", "ends_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "booking_inquiries" (
        "id" uuid NOT NULL,
        "conversation_id" uuid NOT NULL,
        "requester_user_id" uuid NOT NULL,
        "artist_id" uuid,
        "venue_id" uuid,
        "status" character varying(32) NOT NULL,
        "proposed_starts_at" TIMESTAMP WITH TIME ZONE,
        "proposed_ends_at" TIMESTAMP WITH TIME ZONE,
        "notes" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_booking_inquiries" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "outbox_events" (
        "id" uuid NOT NULL,
        "type" character varying(128) NOT NULL,
        "payload" jsonb NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "processed_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_outbox_events" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_outbox_processed" ON "outbox_events" ("processed_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "outbox_events"`);
    await queryRunner.query(`DROP TABLE "booking_inquiries"`);
    await queryRunner.query(`DROP TABLE "venue_unavailabilities"`);
    await queryRunner.query(`DROP TABLE "artist_unavailabilities"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TABLE "chat_conversations"`);
    await queryRunner.query(`DROP TABLE "media_assets"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "venues"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "taxonomy_terms"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "oauth_accounts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
