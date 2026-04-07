import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppPalette } from "@/constants/palette";

export type SettingsNavigationRowProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  backgroundColor: string;
  destructive?: boolean;
  showChevron?: boolean;
  /** Em grupos tipo cartão, a última linha não leva divisor inferior. */
  showDividerBelow?: boolean;
};

export function SettingsNavigationRow({
  title,
  subtitle,
  onPress,
  textColor,
  subtitleColor,
  borderColor,
  backgroundColor,
  destructive,
  showChevron = true,
  showDividerBelow = true,
}: SettingsNavigationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor,
          borderBottomColor: borderColor,
          borderBottomWidth: showDividerBelow ? StyleSheet.hairlineWidth : 0,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.textCol}>
        <Text
          style={[
            styles.title,
            { color: destructive ? AppPalette.error : textColor },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        ) : null}
      </View>
      {showChevron && !destructive ? (
        <Ionicons name="chevron-forward" size={18} color={subtitleColor} style={styles.chevron} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  pressed: { opacity: 0.7 },
  textCol: { flex: 1 },
  title: { fontSize: 16, fontWeight: "500" },
  subtitle: { fontSize: 13, marginTop: 4 },
  chevron: { opacity: 0.55 },
});
