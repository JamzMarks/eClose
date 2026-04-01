import "reflect-metadata";
import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";
import { Initial1730200000000 } from "./migrations/1730200000000-Initial";
import { SnakeNamingStrategy } from "./snake-naming.strategy";
import { ALL_TYPEORM_ENTITIES } from "./typeorm-entities.registry";

config({ path: [join(__dirname, "../../../.env.local"), join(__dirname, "../../../.env")] });

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ALL_TYPEORM_ENTITIES,
  migrations: [Initial1730200000000],
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.TYPEORM_LOGGING === "true",
});
