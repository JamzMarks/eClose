import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type TabScreenCenterLoadingProps = {
  message: string;
  subtitleColor: string;
  /** `embedded`: bloco para `ListEmptyComponent` (altura mínima alinhada com erro/retry). */
  variant?: "fullscreen" | "embedded";
};

export function TabScreenCenterLoading({
  message,
  subtitleColor,
  variant = "fullscreen",
}: TabScreenCenterLoadingProps) {
  const boxStyle = variant === "embedded" ? styles.embedded : styles.fullscreen;
  return (
    <View style={boxStyle}>
      <ActivityIndicator color={AppPalette.primary} size="large" />
      <Text style={[styles.text, { color: subtitleColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  embedded: {
    minHeight: 220,
    paddingVertical: 32,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { marginTop: 12 },
});
