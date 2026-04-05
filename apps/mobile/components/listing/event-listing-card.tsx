import type { EventDto } from "@/services/types/event.types";
import { formatEventRange } from "@/lib/format-date";

import { ListingCardShell } from "./listing-card-shell";
import { ListingTypeChip } from "./listing-type-chip";

export type EventListingCardProps = {
  event: EventDto;
  primaryMediaUrl?: string | null;
  textColor: string;
  subtitleColor: string;
  imagePlaceholderColor: string;
  onlineLabel: string;
  /** Ex.: “Concerto”, “Festival” — mock ou taxonomia. */
  categoryLabel?: string;
  chipTextColor?: string;
  chipBackgroundColor?: string;
  onPress: () => void;
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

export function EventListingCard({
  event,
  primaryMediaUrl,
  textColor,
  subtitleColor,
  imagePlaceholderColor,
  onlineLabel,
  categoryLabel,
  chipTextColor = "#1C1917",
  chipBackgroundColor = "rgba(255,255,255,0.92)",
  onPress,
}: EventListingCardProps) {
  const dateLine = formatEventRange(event.startsAt, event.endsAt);
  const placeLine = eventLocationLine(event, onlineLabel);

  return (
    <ListingCardShell
      imageUri={primaryMediaUrl}
      imageAccessibilityLabel={event.title}
      title={event.title}
      subtitle={dateLine}
      meta={placeLine}
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
