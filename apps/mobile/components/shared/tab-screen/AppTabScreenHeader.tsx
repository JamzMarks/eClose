import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Cabeçalho reutilizável para ecrãs dentro das tabs (título, subtítulo opcional, ação à direita opcional).
 */
export type AppTabScreenHeaderProps = {
  title: string;
  subtitle?: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
  /** Ícone, botão ou grupo à direita (ex.: filtro, “Lista”). */
  trailing?: ReactNode;
};

export function AppTabScreenHeader({
  title,
  subtitle,
  borderColor,
  titleColor,
  subtitleColor,
  trailing,
}: AppTabScreenHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <View style={styles.topRow}>
        <View style={styles.titles}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
          ) : null}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, marginTop: 4 },
  trailing: {
    alignSelf: "flex-start",
    paddingTop: 2,
  },
});
