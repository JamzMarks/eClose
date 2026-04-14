import { Pressable, StyleSheet, Text, View } from "react-native";

import { Paddings, Radii } from "@/constants/layout";
import { formatMyCalendarCompactLine } from "@/lib/format-date";
import type { MyCalendarSavedEvent } from "@/services/my-calendar/my-calendar.types";

export type MyCalendarEventRowProps = {
  row: MyCalendarSavedEvent;
  sourceLabel: string;
  textColor: string;
  subtitleColor: string;
  mutedColor: string;
  borderColor: string;
  surfaceColor: string;
  chipBorderColor: string;
  onlineLabel: string;
  onPress: () => void;
  compact?: boolean;
};

export function MyCalendarEventRow({
  row,
  sourceLabel,
  textColor,
  subtitleColor,
  mutedColor,
  borderColor,
  surfaceColor,
  chipBorderColor,
  onlineLabel,
  onPress,
  compact = false,
}: MyCalendarEventRowProps) {
  const dateLine = formatMyCalendarCompactLine(row.startsAt);
  const place =
    row.locationLabel?.trim() ||
    (row.locationMode === "ONLINE" || row.locationMode === "HYBRID" ? onlineLabel : "—");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${row.title}. ${dateLine}`}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        {
          backgroundColor: surfaceColor,
          borderColor,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {row.title}
        </Text>
        <View style={[styles.chip, { borderColor: chipBorderColor }]}>
          <Text style={[styles.chipText, { color: mutedColor }]} numberOfLines={1}>
            {sourceLabel}
          </Text>
        </View>
      </View>
      <Text style={[styles.meta, { color: subtitleColor }]} numberOfLines={1}>
        {dateLine}
      </Text>
      <Text style={[styles.context, { color: mutedColor }]} numberOfLines={1}>
        {row.contextLabel}
      </Text>
      {!compact ? (
        <Text style={[styles.place, { color: subtitleColor }]} numberOfLines={1}>
          {place}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Paddings.md,
    gap: Paddings.xs,
  },
  cardCompact: {
    paddingVertical: Paddings.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Paddings.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  chip: {
    flexShrink: 0,
    maxWidth: "42%",
    paddingHorizontal: Paddings.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  meta: {
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  context: {
    fontSize: 13,
    lineHeight: 18,
  },
  place: {
    fontSize: 13,
  },
});
