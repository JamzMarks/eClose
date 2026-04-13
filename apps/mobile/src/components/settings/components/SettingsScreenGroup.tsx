import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const GROUP_RULE_OPACITY = 0.38;

export type SettingsScreenGroupProps = {
  children: ReactNode;
  borderColor: string;
  /** Traço inferior após o grupo (separador entre segmentos). */
  showBottomRule: boolean;
  paddingTop?: number;
};

/**
 * Agrupa linhas de definições com o mesmo propósito: sem divisores entre linhas;
 * apenas um separador fraco no fim do grupo.
 */
export function SettingsScreenGroup({
  children,
  borderColor,
  showBottomRule,
  paddingTop = 0,
}: SettingsScreenGroupProps) {
  return (
    <View style={{ paddingTop }}>
      {children}
      {showBottomRule ? (
        <View
          style={[styles.rule, { backgroundColor: borderColor }]}
          pointerEvents="none"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rule: {
    height: 1,
    width: "100%",
    opacity: GROUP_RULE_OPACITY,
    marginTop: 10,
  },
});
