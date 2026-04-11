import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ProfileTopBarProps = {
  handle: string;
  textColor: string;
  borderColor: string;
  settingsA11yLabel: string;
  onOpenSettings: () => void;
  /** Quando o cabeçalho principal da app já tem separador, omitir o traço inferior. */
  showBorder?: boolean;
};

export function ProfileTopBar({
  handle,
  textColor,
  borderColor,
  settingsA11yLabel,
  onOpenSettings,
  showBorder = true,
}: ProfileTopBarProps) {
  return (
    <View
      style={[
        styles.topBar,
        showBorder && { borderBottomColor: borderColor, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}>
      <Text style={[styles.handle, { color: textColor }]}>@{handle}</Text>
      <Pressable
        onPress={onOpenSettings}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={settingsA11yLabel}
      >
        <Ionicons name="settings-outline" size={22} color={textColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  handle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
