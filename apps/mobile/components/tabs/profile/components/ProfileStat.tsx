import { StyleSheet, Text, View } from "react-native";

export type ProfileStatProps = {
  value: string;
  label: string;
  color: string;
  mutedColor: string;
};

export function ProfileStat({ value, label, color, mutedColor }: ProfileStatProps) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    alignItems: "center",
    minWidth: 72,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
