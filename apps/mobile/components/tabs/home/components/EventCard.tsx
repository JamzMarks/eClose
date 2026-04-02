import { Pressable, StyleSheet, Text } from "react-native";

import type { EventDto } from "@/infrastructure/api/types/event.types";
import { formatEventRange } from "@/lib/format-date";

export type EventCardProps = {
  event: EventDto;
  textColor: string;
  subtitleColor: string;
  surfaceColor: string;
  borderColor: string;
  onlineLabel: string;
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

export function EventCard({
  event,
  textColor,
  subtitleColor,
  surfaceColor,
  borderColor,
  onlineLabel,
  onPress,
}: EventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}
    >
      <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
        {event.title}
      </Text>
      <Text style={[styles.meta, { color: subtitleColor }]}>
        {formatEventRange(event.startsAt, event.endsAt)}
      </Text>
      <Text style={[styles.meta, { color: subtitleColor }]} numberOfLines={1}>
        {eventLocationLine(event, onlineLabel)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
  },
  title: { fontSize: 17, fontWeight: "600" },
  meta: { fontSize: 14, marginTop: 6 },
});
