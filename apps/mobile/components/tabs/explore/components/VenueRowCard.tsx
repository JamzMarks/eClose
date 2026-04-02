import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";

export type VenueRowCardProps = {
  card: MarketplaceVenueCardDto;
  textColor: string;
  subtitleColor: string;
  thumbBackgroundColor: string;
  borderColor: string;
  onPress: () => void;
};

export function VenueRowCard({
  card,
  textColor,
  subtitleColor,
  thumbBackgroundColor,
  borderColor,
  onPress,
}: VenueRowCardProps) {
  const { venue, primaryMediaUrl } = card;
  const cityLine = `${venue.address.city}${
    venue.address.region ? ` · ${venue.address.region}` : ""
  }`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { borderBottomColor: borderColor }]}
    >
      <View style={[styles.thumb, { backgroundColor: thumbBackgroundColor }]}>
        {primaryMediaUrl ? (
          <Image
            source={{ uri: primaryMediaUrl }}
            style={styles.thumbImg}
            contentFit="cover"
          />
        ) : null}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
          {venue.name}
        </Text>
        <Text style={[styles.city, { color: subtitleColor }]} numberOfLines={1}>
          {cityLine}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  rowText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  city: { fontSize: 14, marginTop: 4 },
});
