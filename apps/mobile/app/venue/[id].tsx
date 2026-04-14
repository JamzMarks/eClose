import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import type { VenueDto, VenueManageDto, VenueVerificationStatus } from "@/services/types/venue.types";
import { VenueService } from "@/services/venue/venue.service";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { useColorScheme } from "@/hooks/use-color-scheme";

function trustStatusLabel(
  t: (k: string) => string,
  status: VenueVerificationStatus,
): string {
  switch (status) {
    case "pending_review":
      return t("venueTrustStatus_pending_review");
    case "verified_l2":
      return t("venueTrustStatus_verified_l2");
    case "rejected":
      return t("venueTrustStatus_rejected");
    case "pending_documents":
      return t("venueTrustStatus_none");
    default:
      return t("venueTrustStatus_none");
  }
}

export default function VenueDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("discover");
  const { isSignedIn } = useAuth();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [venue, setVenue] = useState<VenueDto | null>(null);
  const [manage, setManage] = useState<VenueManageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: venue?.name ?? t("venueDetail"),
      headerTintColor: AppPalette.primary,
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
    });
  }, [navigation, venue?.name, t, c.surface, c.text]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("—");
      return;
    }
    const svc = new VenueService();
    let cancelled = false;
    setLoading(true);
    setError(null);
    setManage(null);
    void (async () => {
      try {
        const v = await svc.getById(id);
        if (!cancelled) setVenue(v);
        if (isSignedIn) {
          try {
            const m = await svc.getManage(id);
            if (!cancelled) setManage(m);
          } catch {
            if (!cancelled) setManage(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(normalizeHttpError(err, t("error")).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, t, isSignedIn]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator color={AppPalette.primary} size="large" />
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={[styles.err, { color: c.text }]}>{error ?? t("error")}</Text>
      </View>
    );
  }

  const addr = venue.address;
  const addressLine = [addr.line1, addr.postalCode, addr.city, addr.region]
    .filter(Boolean)
    .join(", ");

  const showOwnerTools = Boolean(manage);
  const canStartVerification =
    showOwnerTools &&
    manage!.verificationStatus !== "pending_review" &&
    manage!.verificationStatus !== "verified_l2";

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: c.text }]}>{venue.name}</Text>
      {venue.isVerifiedL2 ? (
        <Text style={[styles.trustBadge, { color: AppPalette.success, borderColor: AppPalette.success }]}>
          {t("trustSemiReliable")}
        </Text>
      ) : null}
      {venue.isVerifiedL2 ? (
        <Text style={[styles.trustBody, { color: c.textSecondary }]}>
          {t("trustVerifiedDetail")}
        </Text>
      ) : null}
      {showOwnerTools ? (
        <View style={[styles.ownerBox, { borderColor: c.border, backgroundColor: c.surface }]}>
          <Text style={[styles.ownerLabel, { color: c.textMuted }]}>{t("venueViewAsOwner")}</Text>
          <Text style={[styles.ownerStatus, { color: c.text }]}>
            {trustStatusLabel(t, manage!.verificationStatus)}
          </Text>
          {canStartVerification ? (
            <Pressable
              onPress={() => router.push(`/venue/${encodeURIComponent(id!)}/verify`)}
              style={({ pressed }) => [styles.ownerCta, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.ownerCtaText}>{t("venueManageVerification")}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <Text style={[styles.section, { color: c.textMuted }]}>{t("location")}</Text>
      <Text style={[styles.body, { color: c.text }]}>{addressLine}</Text>
      {venue.description?.trim() ? (
        <>
          <Text style={[styles.section, { color: c.textMuted }]}>
            {t("description")}
          </Text>
          <Text style={[styles.body, { color: c.text }]}>{venue.description}</Text>
        </>
      ) : null}
      {isSignedIn && venue.openToArtistInquiries && !showOwnerTools ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/booking/new-inquiry",
              params: { venueId: venue.id },
            } as Href)
          }
          style={[styles.bookingCta, { backgroundColor: AppPalette.primary }]}>
          <Text style={styles.bookingCtaText}>{t("bookingInquiryTitle")}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  trustBadge: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  trustBody: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  ownerBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 8,
  },
  ownerLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  ownerStatus: { fontSize: 16, lineHeight: 22 },
  ownerCta: { alignSelf: "flex-start", marginTop: 4 },
  ownerCtaText: { color: AppPalette.primary, fontWeight: "700", fontSize: 16 },
  section: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", marginTop: 16, marginBottom: 6 },
  body: { fontSize: 16, lineHeight: 24 },
  err: { textAlign: "center", paddingHorizontal: 24 },
  bookingCta: { marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  bookingCtaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
