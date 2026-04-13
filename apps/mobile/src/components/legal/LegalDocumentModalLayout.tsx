import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type LegalDocumentModalLayoutProps = {
  title: string;
  versionLine?: string | null;
  onClose: () => void;
  backLabel: string;
  closeA11yLabel: string;
  children: ReactNode;
  /** Barra cosmética tipo sheet (Airbnb-style affordance). */
  showDragHandle?: boolean;
};

/**
 * Chrome partilhado dos documentos legais em modal fullscreen: safe area, handle opcional, título, versão, fecho.
 */
export function LegalDocumentModalLayout({
  title,
  versionLine,
  onClose,
  backLabel,
  closeA11yLabel,
  children,
  showDragHandle = true,
}: LegalDocumentModalLayoutProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top }]}>
      {showDragHandle ? (
        <View style={styles.handleWrap} importantForAccessibility="no">
          <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />
        </View>
      ) : null}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={closeA11yLabel}
          style={styles.headerSide}>
          <Text style={[styles.backLabel, { color: AppPalette.primary }]}>{backLabel}</Text>
        </Pressable>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerSide: {
    minWidth: 72,
    justifyContent: "center",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backLabel: {
    fontSize: 17,
    fontWeight: "600",
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
