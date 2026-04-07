import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type TabScreenCenterErrorProps = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
  variant?: "fullscreen" | "embedded";
};

export function TabScreenCenterError({
  message,
  retryLabel,
  onRetry,
  variant = "fullscreen",
}: TabScreenCenterErrorProps) {
  const boxStyle = variant === "embedded" ? styles.embedded : styles.fullscreen;
  return (
    <View style={boxStyle}>
      <Text style={[styles.errorText, { color: AppPalette.error }]}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={styles.retry}
        accessibilityRole="button"
        accessibilityLabel={retryLabel}
      >
        <Text style={styles.retryText}>{retryLabel}</Text>
      </Pressable>
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
  errorText: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  retry: { paddingVertical: 10, paddingHorizontal: 16 },
  retryText: { color: AppPalette.primary, fontWeight: "600", fontSize: 16 },
});
