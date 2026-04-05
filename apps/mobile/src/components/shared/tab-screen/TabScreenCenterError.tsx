import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type TabScreenCenterErrorProps = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};

export function TabScreenCenterError({
  message,
  retryLabel,
  onRetry,
}: TabScreenCenterErrorProps) {
  return (
    <View style={styles.center}>
      <Text style={[styles.errorText, { color: AppPalette.error }]}>{message}</Text>
      <Pressable onPress={onRetry} style={styles.retry}>
        <Text style={styles.retryText}>{retryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: { textAlign: "center", marginBottom: 12 },
  retry: { padding: 12 },
  retryText: { color: AppPalette.primary, fontWeight: "600" },
});
