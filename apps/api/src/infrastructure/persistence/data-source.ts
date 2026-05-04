import "reflect-metadata";
import { DataSource } from "typeorm";
import { loadAppEnv } from "../config/load-env";
import { Initial1730200000000 } from "./migrations/1730200000000-Initial";
import { FeaturesPhases2To61740100000000 } from "./migrations/1740100000000-FeaturesPhases2To6";
import { BookingRequesterOrganizerArtist1740200000000 } from "./migrations/1740200000000-BookingRequesterOrganizerArtist";
import { SocialFriendshipAndPosts1740300000000 } from "./migrations/1740300000000-SocialFriendshipAndPosts";
import { UserBlocks1740400000000 } from "./migrations/1740400000000-UserBlocks";
import { UserFirstLastNames1740500000000 } from "./migrations/1740500000000-UserFirstLastNames";
import { ProfileNamesAcknowledgedAt1740600000000 } from "./migrations/1740600000000-ProfileNamesAcknowledgedAt";
import { RenameDisplayNameToUsername1740700000000 } from "./migrations/1740700000000-RenameDisplayNameToUsername";
import { SharedEventLists1740800000000 } from "./migrations/1740800000000-SharedEventLists";
import { VenueTrustAndMediaListable1740900000000 } from "./migrations/1740900000000-VenueTrustAndMediaListable";
import { LegalConsentVenueTrustEvidenceAudit1741000000000 } from "./migrations/1741000000000-LegalConsentVenueTrustEvidenceAudit";
import { SnakeNamingStrategy } from "./snake-naming.strategy";
import { ALL_TYPEORM_ENTITIES } from "./typeorm-entities.registry";

loadAppEnv();

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ALL_TYPEORM_ENTITIES,
  migrations: [
    Initial1730200000000,
    FeaturesPhases2To61740100000000,
    BookingRequesterOrganizerArtist1740200000000,
    SocialFriendshipAndPosts1740300000000,
    UserBlocks1740400000000,
    UserFirstLastNames1740500000000,
    ProfileNamesAcknowledgedAt1740600000000,
    RenameDisplayNameToUsername1740700000000,
    SharedEventLists1740800000000,
    VenueTrustAndMediaListable1740900000000,
    LegalConsentVenueTrustEvidenceAudit1741000000000,
  ],
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.TYPEORM_LOGGING === "true",
});
