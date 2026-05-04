import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import type { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings } from "@/constants/layout";
import { AppPalette } from "@/constants/palette";

export type ChatPlainLinkRowProps = {
  icon: AppIcon;
  title: string;
  onPress: () => void;
  /** Cor do texto quando `accentTitle` é false. */
  titleColor: string;
  /** Cor do ícone (predefinição: primária). */
  iconColor?: string;
  iconSize?: "sm" | "md";
  iconFilled?: boolean;
  /** Texto em cor primária (ex.: link de convite). */
  accentTitle?: boolean;
  showChevron?: boolean;
  /** Cor do › quando `showChevron`. */
  mutedColor?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Linha de atalho (ícone + título + opcional ›) — mesmo padrão em Nova mensagem / Novo grupo, sem caixa nem borda.
 */
export function ChatPlainLinkRow({
  icon,
  title,
  onPress,
  titleColor,
  iconColor = AppPalette.primary,
  iconSize = "md",
  iconFilled = false,
  accentTitle = false,
  showChevron = false,
  mutedColor,
  accessibilityLabel: a11yLabel,
  style,
}: ChatPlainLinkRowProps) {
  const labelColor = accentTitle ? AppPalette.primary : titleColor;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }, style]}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}>
      <Icon name={icon} size={iconSize} color={iconColor} filled={iconFilled} />
      <Text style={[styles.title, { color: labelColor }]} numberOfLines={1}>
        {title}
      </Text>
      {showChevron ? (
        <Text style={[styles.chevron, { color: mutedColor ?? titleColor }]}>›</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.sm,
    minHeight: 44,
    marginBottom: Paddings.md,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    lineHeight: 22,
  },
});
