import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import type { ExploreVenuePin } from "@/types/entities/explore.types";
import { Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ExploreVenueCardProps = {
  venue: ExploreVenuePin;
  selected?: boolean;
  onPress?: () => void;
  /** Grelha de 2 colunas no painel (largura fluida). */
  variant?: "grid" | "carousel";
};

export function ExploreVenueCard({ venue, selected, onPress, variant = "grid" }: ExploreVenueCardProps) {
  const router = useRouter();
  const { t } = useTranslation("explore");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  function go() {
    onPress?.();
    router.push(`/venue/${venue.id}`);
  }

  const kindLabel = t(`markers.${venue.kind}`);

  return (
    <Pressable
      onPress={go}
      style={({ pressed }) => [
        styles.card,
        variant === "grid" ? styles.cardGrid : styles.cardCarousel,
        {
          borderColor: selected ? AppPalette.primary : c.border,
          backgroundColor: c.surface,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${venue.title}, ${venue.subtitle}`}>
      <View style={styles.imageWrap}>
        {venue.primaryMediaUrl ? (
          <Image
            source={{ uri: venue.primaryMediaUrl }}
            style={styles.image}
            contentFit="cover"
            transition={120}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: c.border }]} />
        )}
        <View style={[styles.kindPill, { backgroundColor: `${AppPalette.primary}E6` }]}>
          <Text style={styles.kindPillText}>{kindLabel}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {venue.title}
        </Text>
        <Text style={[styles.sub, { color: c.textSecondary }]} numberOfLines={1}>
          {venue.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  cardGrid: {
    width: "100%",
    minWidth: 0,
    flexGrow: 1,
  },
  cardCarousel: {
    width: 268,
    marginRight: 12,
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    height: 112,
    width: "100%",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    flex: 1,
  },
  kindPill: {
    position: "absolute",
    left: 8,
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  kindPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  body: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  sub: {
    fontSize: 13,
  },
});
