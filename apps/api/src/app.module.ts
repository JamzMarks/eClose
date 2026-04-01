import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationCoreModule } from "./infrastructure/application-core.module";
import { ALL_TYPEORM_ENTITIES } from "./infrastructure/persistence/typeorm-entities.registry";
import { SnakeNamingStrategy } from "./infrastructure/persistence/snake-naming.strategy";
import { Initial1730200000000 } from "./infrastructure/persistence/migrations/1730200000000-Initial";
import { PrivateJwtAuthGuard } from "./infrastructure/http/guards/private-jwt-auth.guard";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ChatModule } from "./chat/chat.module";
import { TaxonomyModule } from "./taxonomy/taxonomy.module";
import { VenueModule } from "./venue/venue.module";
import { EventModule } from "./event/event.module";
import { CalendarModule } from "./calendar/calendar.module";
import { MediaModule } from "./media/media.module";
import { ArtistModule } from "./artist/artist.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { BookingModule } from "./booking/booking.module";

@Module({
  imports: [
    ApplicationCoreModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error(
            "DATABASE_URL is required (PostgreSQL connection string). Example: postgresql://user:pass@localhost:5432/eclose",
          );
        }
        return {
          type: "postgres" as const,
          url,
          entities: ALL_TYPEORM_ENTITIES,
          migrations: [Initial1730200000000],
          migrationsRun: process.env.TYPEORM_RUN_MIGRATIONS === "true",
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: process.env.TYPEORM_SYNC === "true",
          logging: process.env.TYPEORM_LOGGING === "true",
        };
      },
    }),
    AuthModule,
    UserModule,
    ChatModule,
    TaxonomyModule,
    MediaModule,
    ArtistModule,
    VenueModule,
    EventModule,
    CalendarModule,
    MarketplaceModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: PrivateJwtAuthGuard },
  ],
})
export class AppModule {}
