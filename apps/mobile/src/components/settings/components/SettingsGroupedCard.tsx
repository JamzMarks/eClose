import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Radius } from "@/constants/layout";

export type SettingsGroupedCardProps = {
  children: ReactNode;
  borderColor: string;
  backgroundColor: string;
};

/**
 * Agrupa linhas de navegação num único cartão (iOS Settings–style).
 */
export function SettingsGroupedCard({ children, borderColor, backgroundColor }: SettingsGroupedCardProps) {
  return (
    <View style={[styles.card, { borderColor, backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
