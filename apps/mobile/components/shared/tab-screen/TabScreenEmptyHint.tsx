import { StyleSheet, Text } from "react-native";

export type TabScreenEmptyHintProps = {
  message: string;
  color: string;
};

export function TabScreenEmptyHint({ message, color }: TabScreenEmptyHintProps) {
  return <Text style={[styles.text, { color }]}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: { textAlign: "center", marginTop: 48, paddingHorizontal: 24 },
});
