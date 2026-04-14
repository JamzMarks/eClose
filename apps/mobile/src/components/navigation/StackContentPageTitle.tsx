import type { ReactNode } from "react";
import { Platform, StyleSheet, Text } from "react-native";

export function StackContentPageTitle({ children, color }: { children: ReactNode; color: string }) {
  return (
    <Text
      style={[styles.title, { color }]}
      {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.45,
    lineHeight: 34,
    marginBottom: 12,
  },
});
