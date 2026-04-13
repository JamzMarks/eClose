import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { AppPressable } from "@/components/ui/Pressable";
import type { AppIcon } from "@/components/ui/icon/icon.types";

export type SettingsAccountExpandableRowProps = {
  icon?: AppIcon;
  title: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  textColor: string;
  mutedColor: string;
  children?: ReactNode;
};

/** Mesmo padrão visual que `SettingsNavigationRow` em modo `flat` (lista Configurações). */
const flatRowStyle: ViewStyle[] = [
  { alignSelf: "stretch" },
  { paddingHorizontal: 0, paddingVertical: 0, minHeight: 64 },
];

/**
 * Linha de conta: rótulo + valor como subtítulo de navegação; toque alterna painel (inputs / acções).
 */
export function SettingsAccountExpandableRow({
  icon,
  title,
  value,
  expanded,
  onToggle,
  textColor,
  mutedColor,
  children,
}: SettingsAccountExpandableRowProps) {
  return (
    <View style={styles.wrap}>
      <AppPressable
        variant="navigation"
        title={title}
        subtitle={value}
        icon={icon}
        color={textColor}
        mutedColor={mutedColor}
        onPress={onToggle}
        accessibilityState={{ expanded }}
        navigationChevron={expanded ? "down" : "forward"}
        style={flatRowStyle}
      />
      {expanded && children ? <View style={styles.panel}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  panel: {
    paddingBottom: 16,
    gap: 12,
  },
});
