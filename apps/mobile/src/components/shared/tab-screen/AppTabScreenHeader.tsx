import type { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import {
  TAB_SCREEN_HEADER_DIVIDER_OPACITY,
  TAB_SCREEN_HEADER_EDGE_SLOT_WIDTH,
  TAB_SCREEN_HEADER_HORIZONTAL_PADDING,
  TAB_SCREEN_HEADER_NATURAL_GAP,
  TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
  TAB_SCREEN_HEADER_VERTICAL_PADDING,
} from "@/components/shared/tab-screen/tabScreenHeader.tokens";

/**
 * Shell de cabeçalho para ecrãs nas tabs: padding, divisor e altura mínima fixos;
 * o conteúdo dispõe-se via `layout`, `titleAlign`, `leading`, `trailing` e `center`.
 *
 * - `layout="auto"`: colunas laterais fixas só quando há `leading` e `trailing` (título centrado na faixa central).
 * - `layout="symmetric"`: faixas laterais fixas só onde há `leading` / `trailing`; com os dois, larguras iguais para centrar o título.
 * - `layout="natural"`: laterais ao tamanho do conteúdo; título na região flex (alinhamento via `titleAlign`).
 */
export type TabScreenHeaderLayout = "auto" | "symmetric" | "natural";

export type TabScreenHeaderTitleAlign = "left" | "center" | "right";

export type AppTabScreenHeaderProps = {
  borderColor: string;
  titleColor: string;
  /** Ignorado quando `center` está definido. */
  title?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  layout?: TabScreenHeaderLayout;
  titleAlign?: TabScreenHeaderTitleAlign;
  /** Conteúdo livre na região central (substitui o `Text` do título). */
  center?: ReactNode;
};

function resolveLayout(
  layout: TabScreenHeaderLayout | undefined,
  leading: ReactNode | undefined,
  trailing: ReactNode | undefined,
): "symmetric" | "natural" {
  if (layout === "symmetric") return "symmetric";
  if (layout === "natural") return "natural";
  if (leading != null && trailing != null) return "symmetric";
  return "natural";
}

function defaultTitleAlign(resolved: "symmetric" | "natural"): TabScreenHeaderTitleAlign {
  return resolved === "symmetric" ? "center" : "left";
}

function titleTextAlign(align: TabScreenHeaderTitleAlign): "left" | "center" | "right" {
  return align;
}

function centerColumnAlignItems(align: TabScreenHeaderTitleAlign) {
  switch (align) {
    case "left":
      return "flex-start" as const;
    case "right":
      return "flex-end" as const;
    default:
      return "center" as const;
  }
}

export function AppTabScreenHeader({
  borderColor,
  titleColor,
  title,
  leading,
  trailing,
  layout = "auto",
  titleAlign: titleAlignProp,
  center,
}: AppTabScreenHeaderProps) {
  const resolvedLayout = resolveLayout(layout, leading, trailing);
  const titleAlign = titleAlignProp ?? defaultTitleAlign(resolvedLayout);

  const titleEl =
    center ??
    (title != null ? (
      <Text
        style={[
          styles.title,
          { color: titleColor, textAlign: titleTextAlign(titleAlign), width: "100%" },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
        {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
        {title}
      </Text>
    ) : null);

  const row =
    resolvedLayout === "symmetric" ? (
      <View style={[styles.row, styles.rowSymmetric]}>
        {leading != null ? <View style={styles.edgeSlotStart}>{leading}</View> : null}
        <View
          style={[
            styles.centerSymmetric,
            { alignItems: centerColumnAlignItems(titleAlign) },
          ]}
          pointerEvents="box-none">
          {titleEl}
        </View>
        {trailing != null ? <View style={styles.edgeSlotEnd}>{trailing}</View> : null}
      </View>
    ) : (
      <View style={[styles.row, styles.rowNatural]}>
        {leading != null ? <View style={styles.leadingNatural}>{leading}</View> : null}
        <View
          style={[
            styles.centerNatural,
            { alignItems: centerColumnAlignItems(titleAlign) },
          ]}
          pointerEvents="box-none">
          {titleEl}
        </View>
        {trailing != null ? <View style={styles.trailingNatural}>{trailing}</View> : null}
      </View>
    );

  return (
    <View style={styles.headerWrap}>
      <View style={styles.header}>{row}</View>
      <View
        style={[styles.headerDivider, { backgroundColor: borderColor }]}
        pointerEvents="none"
      />
    </View>
  );
}

const EDGE_SLOT_W = TAB_SCREEN_HEADER_EDGE_SLOT_WIDTH;

const styles = StyleSheet.create({
  headerWrap: {
    width: "100%",
  },
  header: {
    paddingHorizontal: TAB_SCREEN_HEADER_HORIZONTAL_PADDING,
    paddingVertical: TAB_SCREEN_HEADER_VERTICAL_PADDING,
  },
  headerDivider: {
    height: 1,
    width: "100%",
    opacity: TAB_SCREEN_HEADER_DIVIDER_OPACITY,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
  },
  rowNatural: {
    columnGap: TAB_SCREEN_HEADER_NATURAL_GAP,
  },
  rowSymmetric: {
    columnGap: TAB_SCREEN_HEADER_NATURAL_GAP,
  },
  edgeSlotStart: {
    width: EDGE_SLOT_W,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  edgeSlotEnd: {
    width: EDGE_SLOT_W,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  centerSymmetric: {
    flex: 1,
    minWidth: 0,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
  },
  leadingNatural: {
    flexShrink: 0,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  centerNatural: {
    flex: 1,
    minWidth: 0,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
  },
  trailingNatural: {
    flexShrink: 0,
    minWidth: EDGE_SLOT_W,
    minHeight: TAB_SCREEN_HEADER_ROW_MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 26,
  },
});
