import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";

import { VenueService } from "@/services/venue/venue.service";
import { normalizeHttpError } from "@/infrastructure/http/error-handler";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { findMarketplaceVenueRowById } from "@/services/venue/venue.local-data";
import { EventListingCard } from "@/components/shared/listing/event-listing-card";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import type { VenueDto, VenueManageDto, VenueVerificationStatus } from "@/contracts/venue.types";
import { LOCAL_PUBLISHED_EVENTS } from "@/services/event/event.local-data";

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
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const [venue, setVenue] = useState<VenueDto | null>(null);
  const [manage, setManage] = useState<VenueManageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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

  const marketplaceRow = id ? findMarketplaceVenueRowById(id) : undefined;
  const gallery = useMemo(() => {
    const urls = [
      marketplaceRow?.primaryMediaUrl ?? null,
      ...(marketplaceRow?.galleryUrls ?? []),
    ].filter((u): u is string => Boolean(u));
    if (urls.length > 0) return urls;
    return ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&w=1280&q=75"];
  }, [marketplaceRow?.primaryMediaUrl, marketplaceRow?.galleryUrls]);

  const onPressBack = useCallback(() => {
    router.back();
  }, [router]);

  const onPressShare = useCallback(() => {
    if (!venue) return;
    void Share.share({
      message: `${venue.name}\n/venue/${venue.id}`,
    });
  }, [venue]);

  const onPressMore = useCallback(() => {
    Alert.alert(
      venue?.name ?? t("venueDetail"),
      undefined,
      [
        { text: "Convidar alguém", onPress: () => {} },
        { text: "Adicionar ao grupo", onPress: () => {} },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true },
    );
  }, [venue?.name, t]);

  const onToggleSaved = useCallback(() => {
    setSaved((s) => !s);
  }, []);

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
  const addressLine = [addr.neighborhood, addr.city, addr.region].filter(Boolean).join(" · ");

  const showOwnerTools = Boolean(manage);
  const canStartVerification =
    showOwnerTools &&
    manage!.verificationStatus !== "pending_review" &&
    manage!.verificationStatus !== "verified_l2";

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={styles.carouselWrap}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.carouselContent}
        >
          {gallery.map((url) => (
            <Image
              key={url}
              source={{ uri: url }}
              style={[styles.carouselImage, { width: screenW }]}
              contentFit="cover"
              transition={120}
            />
          ))}
        </ScrollView>

        <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
          <Pressable
            onPress={onPressBack}
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: c.surface, borderColor: c.border },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Icon name={AppIcon.ChevronLeft} size="lg" color={c.text} />
          </Pressable>

          <View style={styles.headerRight}>
            <Pressable
              onPress={onPressShare}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: c.surface, borderColor: c.border },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Compartilhar"
            >
              <Icon name={AppIcon.Share} size="lg" color={c.text} />
            </Pressable>
            <Pressable
              onPress={onPressMore}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: c.surface, borderColor: c.border },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ações"
            >
              <Icon name={AppIcon.More} size="lg" color={c.text} />
            </Pressable>
            <Pressable
              onPress={onToggleSaved}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: c.surface, borderColor: c.border },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Salvar na wishlist"
            >
              <Icon name={AppIcon.Wishlist} size="lg" color={c.text} filled={saved} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.bodyShell, { backgroundColor: c.background, borderTopColor: c.border }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={[styles.title, { color: c.text }]}>{venue.name}</Text>
          {marketplaceRow?.categoryLabel ? (
            <Text style={[styles.subTitle, { color: c.textSecondary }]}>{marketplaceRow.categoryLabel}</Text>
          ) : null}

          <Text style={[styles.meta, { color: c.textSecondary }]}>{addressLine || "—"}</Text>

          {venue.isVerifiedL2 ? (
            <Text style={[styles.trustBadge, { color: AppPalette.success, borderColor: AppPalette.success }]}>
              {t("trustSemiReliable")}
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
                  onPress={() =>
                    Alert.alert(t("venueVerificationSoonTitle"), t("venueVerificationSoonBody"))
                  }
                  style={({ pressed }) => [styles.ownerCta, pressed && { opacity: 0.85 }]}
                >
                  <Text style={styles.ownerCtaText}>{t("venueManageVerification")}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {venue.description?.trim() ? (
            <>
              <Text style={[styles.section, { color: c.textMuted }]}>{t("description")}</Text>
              <Text style={[styles.body, { color: c.text }]}>{venue.description}</Text>
            </>
          ) : null}

          <Text style={[styles.section, { color: c.textMuted, marginTop: 8 }]}>{t("venueUpcomingEventsSection")}</Text>
          <Text style={[styles.subTitle, { color: c.textSecondary, marginTop: 4, marginBottom: 12 }]}>
            {t("venueUpcomingEventsMockHint")}
          </Text>
          {LOCAL_PUBLISHED_EVENTS.slice(0, 3).map((item) => (
            <View key={item.event.id} style={{ marginBottom: 14 }}>
              <EventListingCard
                event={item.event}
                primaryMediaUrl={item.primaryMediaUrl}
                galleryUrls={item.galleryUrls}
                categoryLabel={item.categoryLabel}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                imagePlaceholderColor={c.border}
                onlineLabel={t("online")}
                onPress={() => router.push(`/event/${item.event.id}`)}
                variant="compact"
              />
            </View>
          ))}

          <Text style={[styles.section, { color: c.textMuted, marginTop: 8 }]}>{t("venuePracticalSection")}</Text>
          <Text style={[styles.body, { color: c.text }]}>{addr.line1}</Text>
          <Text style={[styles.meta, { color: c.textSecondary }]}>{addressLine || "—"}</Text>
          <Text style={[styles.meta, { color: c.textSecondary }]}>
            {t("venueTimezoneLabel")}: {venue.timezone}
          </Text>
          <Text style={[styles.body, { color: c.textSecondary, marginTop: 10, lineHeight: 22 }]}>
            {t("venueOpeningHoursPlaceholder")}
          </Text>

          {isSignedIn && venue.openToArtistInquiries && !showOwnerTools ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/booking/new-inquiry",
                  params: { venueId: venue.id },
                } as Href)
              }
              style={[styles.bookingCta, { backgroundColor: AppPalette.primary }]}
            >
              <Text style={styles.bookingCtaText}>{t("bookingInquiryTitle")}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  carouselWrap: { height: 320, backgroundColor: "#000" },
  carouselContent: { height: "100%" },
  carouselImage: { height: "100%" },
  bodyShell: {
    flex: 1,
    marginTop: -18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.86 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.3, marginTop: 14 },
  subTitle: { marginTop: 6, fontSize: 15, fontWeight: "600" },
  meta: { marginTop: 10, fontSize: 14 },
  trustBadge: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
  },
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
