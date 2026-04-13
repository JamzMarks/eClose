import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { TAB_SCREEN_HEADER_HORIZONTAL_PADDING } from "@/components/shared/tab-screen/tabScreenHeader.tokens";

const BACK_CIRCLE_SIZE = 36;

export function minimalStackBackCircleBackground(scheme: "light" | "dark"): string {
  return scheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)";
}

export type MinimalStackHeaderChrome = {
  /** Cor da barra nativa (igual ao fundo do ecrã) — evita header transparente / botão “flutuante”. */
  headerBackgroundColor: string;
  tintColor: string;
  circleBackgroundColor: string;
  backAccessibilityLabel: string;
};

export function MinimalStackBackButton({
  tintColor,
  circleBackgroundColor,
  accessibilityLabel,
}: {
  tintColor: string;
  circleBackgroundColor: string;
  accessibilityLabel: string;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.backCircle, { backgroundColor: circleBackgroundColor, opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.iconSlot} pointerEvents="none">
        <Icon name={AppIcon.ChevronLeft} size="md" color={tintColor} />
      </View>
    </Pressable>
  );
}

export function buildMinimalStackHeaderOptions(
  chrome: MinimalStackHeaderChrome,
  options?: { headerRight?: () => ReactNode },
): NativeStackNavigationOptions {
  return {
    /** Expo Router usa o nome do ficheiro (ex.: `index`) como título por defeito; tem de ficar vazio. */
    title: "",
    headerTitle: () => null,
    headerTitleAlign: "left",
    headerBackVisible: false,
    headerShadowVisible: false,
    headerTransparent: false,
    headerStyle: {
      backgroundColor: chrome.headerBackgroundColor,
      ...(Platform.OS === "android" ? { elevation: 0 } : {}),
    },
    headerTintColor: chrome.tintColor,
    headerLeft: () => (
      <View style={styles.headerSide}>
        <MinimalStackBackButton
          tintColor={chrome.tintColor}
          circleBackgroundColor={chrome.circleBackgroundColor}
          accessibilityLabel={chrome.backAccessibilityLabel}
        />
      </View>
    ),
    headerRight:
      options?.headerRight != null
        ? () => <View style={styles.headerSideEnd}>{options.headerRight!()}</View>
        : undefined,
  };
}

const styles = StyleSheet.create({
  headerSide: {
    paddingLeft: TAB_SCREEN_HEADER_HORIZONTAL_PADDING,
    flexDirection: "row",
    alignItems: "center",
  },
  headerSideEnd: {
    paddingRight: TAB_SCREEN_HEADER_HORIZONTAL_PADDING,
    flexDirection: "row",
    alignItems: "center",
  },
  backCircle: {
    width: BACK_CIRCLE_SIZE,
    height: BACK_CIRCLE_SIZE,
    borderRadius: BACK_CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Recorta o glyph para não herdar “ar” extra do viewBox do ícone. */
  iconSlot: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: -1,
  },
});
