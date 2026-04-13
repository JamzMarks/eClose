import { StyleSheet, Text, View } from "react-native";

export type SettingsValueRowProps = {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
  borderColor: string;
  backgroundColor: string;
  /**
   * Dentro de um `SettingsScreenGroup`: fundo transparente, sem borda inferior
   * (o grupo trata do separador).
   */
  flat?: boolean;
};

export function SettingsValueRow({
  label,
  value,
  labelColor,
  valueColor,
  borderColor,
  backgroundColor,
  flat = false,
}: SettingsValueRowProps) {
  return (
    <View
      style={[
        styles.row,
        flat ? styles.rowFlat : [styles.rowCard, { backgroundColor, borderBottomColor: borderColor }],
      ]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
  },
  rowCard: {
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowFlat: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  label: { fontSize: 13, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "500" },
});
