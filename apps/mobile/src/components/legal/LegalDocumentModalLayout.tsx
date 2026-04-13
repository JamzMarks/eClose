import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MinimalStackBackButton,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { Layout } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type LegalDocumentModalLayoutProps = {
  title: string;
  versionLine?: string | null;
  onClose: () => void;
  backAccessibilityLabel: string;
  children: ReactNode;
  /** Barra cosmética tipo sheet; desligada para alinhar com stacks tipo definições. */
  showDragHandle?: boolean;
};

/**
 * Chrome partilhado dos documentos legais em modal fullscreen: safe area, handle opcional, título, versão, fecho.
 * Voltar alinhado ao header minimal (círculo + chevron).
 */
export function LegalDocumentModalLayout({
  title,
  versionLine,
  onClose,
  backAccessibilityLabel,
  children,
  showDragHandle = false,
}: LegalDocumentModalLayoutProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  return (
    <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top }]}>
      {showDragHandle ? (
        <View style={styles.handleWrap} importantForAccessibility="no">
          <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />
        </View>
      ) : null}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <View style={styles.headerSide}>
          <MinimalStackBackButton
            tintColor={c.text}
            circleBackgroundColor={minimalStackBackCircleBackground(isDark ? "dark" : "light")}
            accessibilityLabel={backAccessibilityLabel}
            onPress={onClose}
          />
        </View>
        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: c.text }]} numberOfLines={1}>
            {title}
          </Text>
          {versionLine ? (
            <Text style={[styles.versionLine, { color: c.textSecondary }]} numberOfLines={2}>
              {versionLine}
            </Text>
          ) : null}
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.55,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Layout.tab.header.horizontalPadding,
    paddingRight: Layout.tab.header.horizontalPadding - 4,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerSide: {
    minWidth: 40,
    justifyContent: "center",
  },
  headerSideRight: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  headerTitleBlock: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  versionLine: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
