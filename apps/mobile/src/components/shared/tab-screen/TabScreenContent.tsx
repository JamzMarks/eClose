import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { Layout } from "@/constants/layout";

export type TabScreenContentProps = {
  children: ReactNode;
  /** Mapa e conteúdos full-bleed: sem padding/margin horizontal no wrapper. */
  edgeToEdge?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Área abaixo do `AppTabScreenHeader` nas tabs: alinha o conteúdo ao gutter X da app.
 */
export function TabScreenContent({ children, edgeToEdge, style }: TabScreenContentProps) {
  return (
    <View style={[styles.fill, !edgeToEdge && styles.padded, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  padded: { paddingHorizontal: Layout.tab.content.horizontalPadding },
});
