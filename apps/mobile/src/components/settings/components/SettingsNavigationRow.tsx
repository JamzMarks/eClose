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
}: SettingsNavigationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor, borderBottomColor: borderColor },
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
        <Ionicons name="chevron-forward" size={20} color={subtitleColor} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  pressed: { opacity: 0.7 },
  textCol: { flex: 1 },
  title: { fontSize: 16 },
  subtitle: { fontSize: 13, marginTop: 4 },
});
