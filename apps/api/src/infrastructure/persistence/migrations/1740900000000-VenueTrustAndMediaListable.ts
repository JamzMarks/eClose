import { MigrationInterface, QueryRunner } from "typeorm";

export class VenueTrustAndMediaListable1740900000000 implements MigrationInterface {
  name = "VenueTrustAndMediaListable1740900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "media_assets"
      ADD "listable" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "verification_status" character varying(32) NOT NULL DEFAULT 'none'
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "cnpj" character varying(14)
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "verification_cnpj_doc_media_asset_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "venues"
      ADD "verification_address_proof_media_asset_id" uuid
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "venues" DROP COLUMN "verification_address_proof_media_asset_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "venues" DROP COLUMN "verification_cnpj_doc_media_asset_id"
    `);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "cnpj"`);
    await queryRunner.query(`
      ALTER TABLE "venues" DROP COLUMN "verification_status"
    `);
    await queryRunner.query(`ALTER TABLE "media_assets" DROP COLUMN "listable"`);
  }
}
