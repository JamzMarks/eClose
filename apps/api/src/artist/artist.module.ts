import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaxonomyModule } from "@/taxonomy/taxonomy.module";
import { MediaModule } from "@/media/media.module";
import { ArtistOrmEntity } from "@/artist/infrastructure/persistence/artist.orm-entity";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./application/artist.service";
import { ArtistAccessPolicyImpl } from "./infrastructure/artist-access.policy.impl";
import { HttpArtistMediaAdapter } from "./infrastructure/http-artist-media.adapter";
import { LocalArtistMediaAdapter } from "./infrastructure/local-artist-media.adapter";
import { TypeormArtistRepository } from "./infrastructure/typeorm-artist.repository";
import { ARTIST_ACCESS_POLICY } from "./application/ports/artist-access.policy.port";
import { ARTIST_MEDIA_PORT } from "./tokens/artist-media.tokens";
import { ARTIST_REPOSITORY, ARTIST_SERVICE } from "./tokens/artist.tokens";

const artistMediaProvider = {
  provide: ARTIST_MEDIA_PORT,
  useClass: process.env.MEDIA_ADAPTER === "http" ? HttpArtistMediaAdapter : LocalArtistMediaAdapter,
};

@Module({
  imports: [TypeOrmModule.forFeature([ArtistOrmEntity]), TaxonomyModule, MediaModule],
  controllers: [ArtistController],
  providers: [
    { provide: ARTIST_REPOSITORY, useClass: TypeormArtistRepository },
    { provide: ARTIST_ACCESS_POLICY, useClass: ArtistAccessPolicyImpl },
    artistMediaProvider,
    { provide: ARTIST_SERVICE, useClass: ArtistService },
  ],
  exports: [ARTIST_SERVICE, ARTIST_REPOSITORY, ARTIST_ACCESS_POLICY],
})
export class ArtistModule {}
