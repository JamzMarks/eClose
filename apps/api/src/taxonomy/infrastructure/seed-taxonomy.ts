import { TaxonomyTerm } from "../entity/taxonomy-term.entity";
import { TaxonomyKind } from "../types/taxonomy-kind.type";

/** Termos iniciais; no futuro migram para admin/CMS sem mudar o modelo */
export function seedTaxonomyTerms(idGen: { generate(): string }): TaxonomyTerm[] {
  const nextId = () => idGen.generate();
  const t = (
    kind: TaxonomyKind,
    slug: string,
    label: string,
    sortOrder: number,
    facet?: Record<string, unknown>,
  ) =>
    TaxonomyTerm.create({
      id: nextId(),
      kind,
      slug,
      label,
      sortOrder,
      active: true,
      facetMetadata: facet ?? {},
    });

  return [
    t(TaxonomyKind.EVENT_TYPE, "show", "Show", 10, { recoWeight: 1 }),
    t(TaxonomyKind.EVENT_TYPE, "festival", "Festival", 20, { recoWeight: 1 }),
    t(TaxonomyKind.EVENT_TYPE, "workshop", "Workshop", 30),
    t(TaxonomyKind.EVENT_TYPE, "live-stream", "Live online", 40),
    t(TaxonomyKind.EVENT_TYPE, "meetup", "Meetup", 50),

    t(TaxonomyKind.INTEREST, "rock", "Rock", 10, { genreCluster: "popular" }),
    t(TaxonomyKind.INTEREST, "eletronica", "Eletrônica", 20, { genreCluster: "dance" }),
    t(TaxonomyKind.INTEREST, "jazz", "Jazz", 30),
    t(TaxonomyKind.INTEREST, "mpb", "MPB", 40),
    t(TaxonomyKind.INTEREST, "familia", "Família", 50, { audience: "all-ages" }),
    t(TaxonomyKind.INTEREST, "gastronomia", "Gastronomia", 60),
    t(TaxonomyKind.INTEREST, "esporte", "Esporte", 70),
    t(TaxonomyKind.INTEREST, "arte", "Arte", 80),

    t(TaxonomyKind.VENUE_TYPE, "bar", "Bar", 10),
    t(TaxonomyKind.VENUE_TYPE, "casa-de-shows", "Casa de shows", 20),
    t(TaxonomyKind.VENUE_TYPE, "teatro", "Teatro", 30),
    t(TaxonomyKind.VENUE_TYPE, "arena", "Arena", 40),
    t(TaxonomyKind.VENUE_TYPE, "open-air", "Ao ar livre", 50),

    t(TaxonomyKind.VENUE_AMENITY, "estacionamento", "Estacionamento", 10),
    t(TaxonomyKind.VENUE_AMENITY, "acessibilidade", "Acessibilidade", 20),
    t(TaxonomyKind.VENUE_AMENITY, "area-vip", "Área VIP", 30),

    t(TaxonomyKind.GENRE, "indie", "Indie", 10),
    t(TaxonomyKind.GENRE, "pop", "Pop", 20),
  ];
}
