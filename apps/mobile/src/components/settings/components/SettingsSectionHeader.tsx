import { StyleSheet, Text, View } from "react-native";

export type SettingsSectionHeaderProps = {
  title: string;
  color: string;
};

export function SettingsSectionHeader({ title, color }: SettingsSectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
