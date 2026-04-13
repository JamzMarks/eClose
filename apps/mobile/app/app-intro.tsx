/**
 * Rota `/app-intro` — slides de boas-vindas (persistência `@eclose/app_intro_v1`).
 * Continuação de cadastro: `@/features/account-setup`.
 */
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_INTRO_SLIDES, useAppIntro } from "@/features/app-intro";
import { useAuth } from "@/contexts/auth-context";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/layout";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width: SCREEN_W } = Dimensions.get("window");

export default function AppIntroRoute() {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn } = useAuth();
  const { hydrated, introPending, completeIntro, skipIntro } = useAppIntro();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / SCREEN_W);
    setPage(Math.max(0, Math.min(APP_INTRO_SLIDES.length - 1, i)));
  }, []);

  const goNext = useCallback(() => {
    if (page >= APP_INTRO_SLIDES.length - 1) return;
    const next = page + 1;
    scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
    setPage(next);
  }, [page]);

  const onDone = useCallback(async () => {
    await completeIntro();
    router.replace("/(tabs)");
  }, [completeIntro, router]);

  const onSkip = useCallback(async () => {
    await skipIntro();
    router.replace("/(tabs)");
  }, [router, skipIntro]);

  if (!isReady || !hydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  if (!introPending) {
    return <Redirect href="/(tabs)" />;
  }

  const isLast = page === APP_INTRO_SLIDES.length - 1;

  return (
    <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top }]}>
      <View style={[styles.topBar, { paddingHorizontal: 20 }]}>
        <Pressable onPress={() => void onSkip()} hitSlop={12} accessibilityRole="button">
          <Text style={[styles.skip, { color: AppPalette.primary }]}>{t("appIntroSkip")}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled">
        {APP_INTRO_SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.page, { width: SCREEN_W }]}>
            <Text style={[styles.title, { color: c.text }]}>{t(slide.titleKey)}</Text>
            <Text style={[styles.body, { color: c.textSecondary }]}>{t(slide.bodyKey)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, paddingHorizontal: 20 }]}>
        <View style={styles.dots}>
          {APP_INTRO_SLIDES.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                {
                  backgroundColor: i === page ? AppPalette.primary : c.border,
                  width: i === page ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={() => void (isLast ? onDone() : goNext())}
          style={[styles.cta, { backgroundColor: AppPalette.primary }]}
          accessibilityRole="button">
          <Text style={styles.ctaText}>{isLast ? t("appIntroDone") : t("appIntroNext")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 8,
  },
  skip: { fontSize: 16, fontWeight: "600" },
  page: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginBottom: 16 },
  body: { fontSize: 17, lineHeight: 26 },
  footer: { gap: 20 },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  dot: { height: 8, borderRadius: Radius.full },
  cta: {
    paddingVertical: 16,
    borderRadius: Radius.medium,
    alignItems: "center",
  },
  ctaText: { color: AppPalette.white, fontSize: 17, fontWeight: "700" },
});
