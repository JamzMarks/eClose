import { StyleSheet, Text, View } from "react-native";

export type TabScreenEmptyHintProps = {
  message: string;
  color: string;
  /** Área mínima centrada (listagens com o mesmo alinhamento que loading/erro). */
  minHeight?: number;
};

export function TabScreenEmptyHint({ message, color, minHeight }: TabScreenEmptyHintProps) {
  const inner = (
    <Text
      style={[styles.text, minHeight == null && styles.textLoose, { color }]}
      accessibilityRole="text"
    >
      {message}
    </Text>
  );
  if (minHeight == null) return inner;
  return (
    <View style={[styles.wrap, { minHeight }]}>{inner}</View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: { textAlign: "center", fontSize: 15, lineHeight: 22 },
  textLoose: { marginTop: 48 },
});
