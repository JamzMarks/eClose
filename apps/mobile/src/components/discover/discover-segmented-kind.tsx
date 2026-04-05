import { Pressable, StyleSheet, Text, View } from "react-native";

export type DiscoverListKind = "events" | "venues";

export type DiscoverSegmentedKindProps = {
  value: DiscoverListKind;
  onChange: (value: DiscoverListKind) => void;
  labels: { events: string; venues: string };
  activeBackground: string;
  activeText: string;
  inactiveText: string;
  trackBackground: string;
};

export function DiscoverSegmentedKind({
  value,
  onChange,
  labels,
  activeBackground,
  activeText,
  inactiveText,
  trackBackground,
}: DiscoverSegmentedKindProps) {
  return (
    <View style={[styles.track, { backgroundColor: trackBackground }]}>
      <Pressable
        onPress={() => onChange("events")}
        style={[styles.segment, value === "events" && { backgroundColor: activeBackground }]}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "events" }}>
        <Text style={[styles.label, { color: value === "events" ? activeText : inactiveText }]}>
          {labels.events}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("venues")}
        style={[styles.segment, value === "venues" && { backgroundColor: activeBackground }]}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "venues" }}>
        <Text style={[styles.label, { color: value === "venues" ? activeText : inactiveText }]}>
          {labels.venues}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
