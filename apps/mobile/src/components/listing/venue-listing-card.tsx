import type { MarketplaceVenueCardDto } from "@/services/types/venue.types";

import { ListingCardShell } from "./listing-card-shell";
import { ListingTypeChip } from "./listing-type-chip";

export type VenueListingCardProps = {
  card: MarketplaceVenueCardDto & { galleryUrls?: string[] };
  /** Ex.: tipo de espaço (sala, bar, estúdio) — mock ou taxonomia futura. */
  categoryLabel?: string;
  chipTextColor?: string;
  chipBackgroundColor?: string;
  textColor: string;
  subtitleColor: string;
  imagePlaceholderColor: string;
  onPress: () => void;
};

function citySubtitle(card: MarketplaceVenueCardDto): string {
  const { city, region } = card.venue.address;
  return region ? `${city} · ${region}` : city;
}

export function VenueListingCard({
  card,
  categoryLabel,
  chipTextColor = "#1C1917",
  chipBackgroundColor = "rgba(255,255,255,0.92)",
  textColor,
  subtitleColor,
  imagePlaceholderColor,
  onPress,
}: VenueListingCardProps) {
  const { venue, primaryMediaUrl, galleryUrls } = card;
  const mediaUrls = [primaryMediaUrl, ...(galleryUrls ?? [])].filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );

  return (
    <ListingCardShell
      mediaUrls={mediaUrls}
      imageAccessibilityLabel={venue.name}
      title={venue.name}
      subtitle={citySubtitle(card)}
      onPress={onPress}
      imageOverlay={
        categoryLabel ? (
          <ListingTypeChip
            label={categoryLabel}
            textColor={chipTextColor}
            backgroundColor={chipBackgroundColor}
          />
        ) : undefined
      }
      colors={{
        text: textColor,
        subtitle: subtitleColor,
        imagePlaceholder: imagePlaceholderColor,
      }}
    />
  );
}
