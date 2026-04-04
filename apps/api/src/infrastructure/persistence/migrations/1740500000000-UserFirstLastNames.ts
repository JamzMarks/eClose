import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFirstLastNames1740500000000 implements MigrationInterface {
  name = "UserFirstLastNames1740500000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
  }
}
