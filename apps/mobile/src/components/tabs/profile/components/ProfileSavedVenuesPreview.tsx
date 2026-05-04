import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { ExploreVenueCard } from "@/components/tabs/explore/explore-venue-card";
import type { ExploreVenuePin } from "@/types/entities/explore.types";
import { Radii } from "@/constants/layout";
import { AppPalette } from "@/constants/palette";
import { profileSavedVenuePinsMock } from "@/services/profile/profile-saved-venues.mock";
export type ProfileSavedVenuesPreviewProps = {
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  surfaceColor: string;
};

export function ProfileSavedVenuesPreview({
  textColor,
  subtitleColor,
  borderColor,
  surfaceColor,
}: ProfileSavedVenuesPreviewProps) {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const pins = profileSavedVenuePinsMock() as ExploreVenuePin[];

  return (
    <View
      style={[
        styles.card,
        {
          borderColor,
          backgroundColor: surfaceColor,
        },
      ]}>
      <Text style={[styles.title, { color: textColor }]}>{t("profileSavedVenuesTitle")}</Text>
      <Text style={[styles.hint, { color: subtitleColor }]}>{t("profileSavedVenuesHint")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}>
        {pins.map((venue) => (
          <ExploreVenueCard key={venue.id} venue={venue} variant="carousel" />
        ))}
      </ScrollView>
      <Pressable
        onPress={() => router.push("/explore")}
        accessibilityRole="button"
        accessibilityLabel={t("profileSavedVenuesSeeExplore")}
        style={({ pressed }) => [
          styles.linkBtn,
          {
            borderColor: AppPalette.primary,
            backgroundColor: pressed ? `${AppPalette.primary}22` : `${AppPalette.primary}12`,
          },
        ]}>
        <Text style={[styles.linkText, { color: AppPalette.primary }]}>{t("profileSavedVenuesSeeExplore")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  scroll: {
    marginHorizontal: -14,
    paddingHorizontal: 14,
  },
  row: {
    gap: 0,
    paddingVertical: 4,
    alignItems: "stretch",
  },
  linkBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
