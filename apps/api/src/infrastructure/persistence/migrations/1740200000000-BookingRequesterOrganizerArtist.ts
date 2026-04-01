import { MigrationInterface, QueryRunner } from "typeorm";

export class BookingRequesterOrganizerArtist1740200000000 implements MigrationInterface {
  name = "BookingRequesterOrganizerArtist1740200000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_inquiries" ADD COLUMN "requester_organizer_artist_id" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_inquiries" DROP COLUMN "requester_organizer_artist_id"`,
    );
  }
}
