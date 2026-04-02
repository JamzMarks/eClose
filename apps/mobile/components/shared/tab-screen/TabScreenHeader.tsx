import { StyleSheet, Text, View } from "react-native";

export type TabScreenHeaderProps = {
  title: string;
  subtitle?: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
};

export function TabScreenHeader({
  title,
  subtitle,
  borderColor,
  titleColor,
  subtitleColor,
}: TabScreenHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, marginTop: 4 },
});
