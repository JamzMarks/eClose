import "reflect-metadata";
import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";
import { Initial1730200000000 } from "./migrations/1730200000000-Initial";
import { FeaturesPhases2To61740100000000 } from "./migrations/1740100000000-FeaturesPhases2To6";
import { BookingRequesterOrganizerArtist1740200000000 } from "./migrations/1740200000000-BookingRequesterOrganizerArtist";
import { SocialFriendshipAndPosts1740300000000 } from "./migrations/1740300000000-SocialFriendshipAndPosts";
import { SnakeNamingStrategy } from "./snake-naming.strategy";
import { ALL_TYPEORM_ENTITIES } from "./typeorm-entities.registry";

config({ path: [join(__dirname, "../../../.env.local"), join(__dirname, "../../../.env")] });

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ALL_TYPEORM_ENTITIES,
  migrations: [
    Initial1730200000000,
    FeaturesPhases2To61740100000000,
    BookingRequesterOrganizerArtist1740200000000,
    SocialFriendshipAndPosts1740300000000,
  ],
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.TYPEORM_LOGGING === "true",
});
