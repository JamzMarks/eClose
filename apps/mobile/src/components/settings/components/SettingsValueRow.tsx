import { StyleSheet, Text, View } from "react-native";

export type SettingsValueRowProps = {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
  borderColor: string;
  backgroundColor: string;
};

export function SettingsValueRow({
  label,
  value,
  labelColor,
  valueColor,
  borderColor,
  backgroundColor,
}: SettingsValueRowProps) {
  return (
    <View style={[styles.row, { backgroundColor, borderBottomColor: borderColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 13, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "500" },
});
