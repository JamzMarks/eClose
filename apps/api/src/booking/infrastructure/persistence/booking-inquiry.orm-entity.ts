import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("booking_inquiries")
export class BookingInquiryOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "conversation_id", type: "uuid" })
  conversationId!: string;

  @Column({ name: "requester_user_id", type: "uuid" })
  requesterUserId!: string;

  @Column({ name: "artist_id", type: "uuid", nullable: true })
  artistId!: string | null;

  @Column({ name: "venue_id", type: "uuid", nullable: true })
  venueId!: string | null;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ name: "proposed_starts_at", type: "timestamptz", nullable: true })
  proposedStartsAt!: Date | null;

  @Column({ name: "proposed_ends_at", type: "timestamptz", nullable: true })
  proposedEndsAt!: Date | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ name: "linked_event_id", type: "uuid", nullable: true })
  linkedEventId!: string | null;

  /** Artista do solicitante (pedidos a venue): usado para calendário e criação de evento */
  @Column({ name: "requester_organizer_artist_id", type: "uuid", nullable: true })
  requesterOrganizerArtistId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
