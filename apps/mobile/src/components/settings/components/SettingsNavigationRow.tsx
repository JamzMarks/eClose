import { StyleSheet, View } from "react-native";

import { AppPressable } from "@/components/ui/Pressable";
import type { AppIcon } from "@/components/ui/icon/icon.types";

export type SettingsNavigationRowProps = {
  title: string;
  /** Ícone à esquerda (lista de perfil / definições). */
  icon?: AppIcon;
  subtitle?: string;
  onPress: () => void;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  /** Mantido por compatibilidade com cartões agrupados; o fundo vem do cartão. */
  backgroundColor: string;
  destructive?: boolean;
  showChevron?: boolean;
  /** Em grupos tipo cartão, a última linha não leva divisor inferior. */
  showDividerBelow?: boolean;
  /**
   * Lista plana (ex.: tab Perfil): sem divisor entre linhas, sem padding interno no pressable,
   * fundo transparente — separadores só ao nível da secção.
   */
  flat?: boolean;
};

export function SettingsNavigationRow({
  title,
  icon,
  subtitle,
  onPress,
  textColor,
  subtitleColor,
  borderColor,
  backgroundColor: _backgroundColor,
  destructive,
  showChevron = true,
  showDividerBelow = true,
  flat = false,
}: SettingsNavigationRowProps) {
  const pressable = (
    <AppPressable
      variant="navigation"
      icon={icon}
      title={title}
      subtitle={subtitle}
      color={destructive ? undefined : textColor}
      mutedColor={subtitleColor}
      showChevron={showChevron && !destructive}
      destructive={destructive}
      onPress={onPress}
      style={[styles.pressable, flat && styles.pressableFlat]}
    />
  );

  if (flat) {
    return pressable;
  }

  return (
    <View
      style={[
        styles.dividerWrap,
        {
          borderBottomColor: borderColor,
          borderBottomWidth: showDividerBelow ? StyleSheet.hairlineWidth : 0,
        },
      ]}>
      {pressable}
    </View>
  );
}

const styles = StyleSheet.create({
  dividerWrap: {
    overflow: "hidden",
  },
  pressable: {
    alignSelf: "stretch",
  },
  pressableFlat: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 64,
  },
});
