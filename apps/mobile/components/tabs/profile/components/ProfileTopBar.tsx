import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ProfileTopBarProps = {
  handle: string;
  textColor: string;
  borderColor: string;
  settingsA11yLabel: string;
  onOpenSettings: () => void;
};

export function ProfileTopBar({
  handle,
  textColor,
  borderColor,
  settingsA11yLabel,
  onOpenSettings,
}: ProfileTopBarProps) {
  return (
    <View style={[styles.topBar, { borderBottomColor: borderColor }]}>
      <Text style={[styles.handle, { color: textColor }]}>@{handle}</Text>
      <Pressable
        onPress={onOpenSettings}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={settingsA11yLabel}
      >
        <Ionicons name="settings-outline" size={26} color={textColor} />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  handle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
