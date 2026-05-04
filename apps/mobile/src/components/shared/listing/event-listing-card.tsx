import type { EventDto } from "@/contracts/event.types";
import { formatEventRange } from "@/lib/format-date";

import { ListingCardShell } from "./listing-card-shell";
import { ListingTypeChip } from "./listing-type-chip";

/** `compact` = grelha; `hero` = destaque no feed (imagem mais alta). */
export type EventListingCardVariant = "list" | "compact" | "hero";

export type EventListingCardProps = {
  event: EventDto;
  primaryMediaUrl?: string | null;
  /** Imagens extra no carrossel (além da capa). */
  galleryUrls?: string[];
  textColor: string;
  subtitleColor: string;
  imagePlaceholderColor: string;
  onlineLabel: string;
  /** Ex.: “Concerto”, “Festival” — mock ou taxonomia. */
  categoryLabel?: string;
  chipTextColor?: string;
  chipBackgroundColor?: string;
  onPress: () => void;
  /** Grelha 2 colunas: imagem mais baixa e cartão mais compacto. */
  cardInnerWidth?: number;
  /** @deprecated Prefer `variant`. */
  gridMode?: boolean;
  variant?: EventListingCardVariant;
};

function eventLocationLine(event: EventDto, onlineLabel: string): string {
  const fromLabel = event.locationLabel?.trim();
  if (fromLabel) return fromLabel;
  const adhoc =
    typeof event.adhocAddress === "object" &&
    event.adhocAddress &&
    "city" in event.adhocAddress
      ? String((event.adhocAddress as { city?: string }).city ?? "").trim()
      : "";
  if (adhoc) return adhoc;
  if (event.locationMode === "ONLINE") return onlineLabel;
  return "—";
}

function mediaUrlsForCard(primary: string | null | undefined, gallery?: string[]): string[] {
  return [primary, ...(gallery ?? [])].filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

export function EventListingCard({
  event,
  primaryMediaUrl,
  galleryUrls,
  textColor,
  subtitleColor,
  imagePlaceholderColor,
  onlineLabel,
  categoryLabel,
  chipTextColor = "#1C1917",
  chipBackgroundColor = "rgba(255,255,255,0.92)",
  onPress,
  cardInnerWidth,
  gridMode = false,
  variant: variantProp,
}: EventListingCardProps) {
  const variant: EventListingCardVariant = variantProp ?? (gridMode ? "compact" : "list");
  const dateLine = formatEventRange(event.startsAt, event.endsAt);
  const placeLine = eventLocationLine(event, onlineLabel);

  const carouselHeight = variant === "compact" ? 104 : undefined;
  const marginBottom = variant === "compact" ? 12 : 18;
  const emphasis = variant === "hero" ? "hero" : "default";

  return (
    <ListingCardShell
      mediaUrls={mediaUrlsForCard(primaryMediaUrl ?? null, galleryUrls)}
      imageAccessibilityLabel={event.title}
      title={event.title}
      subtitle={dateLine}
      meta={placeLine}
      onPress={onPress}
      cardInnerWidth={cardInnerWidth}
      carouselHeight={carouselHeight}
      marginBottom={marginBottom}
      emphasis={emphasis}
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
