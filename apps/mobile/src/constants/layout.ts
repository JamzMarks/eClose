/**
 * Tokens globais de layout/spacing do projeto.
 * Preferir estes objetos a tokens locais em componentes.
 */

export const Paddings = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px (gutter padrão do app) */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
} as const;

export const Radii = {
  /** Chips, inputs compactos */
  xs: 6,
  /** Botões pequenos, tags */
  sm: 10,
  /** Cards de lista, modais leves */
  md: 14,
  /** Cartões hero, sheets */
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const Layout = {
  gutter: {
    horizontal: Paddings.xl,
  },
  tab: {
    header: {
      horizontalPadding: Paddings.xl,
      /** Barra de título das tabs: compacta para ganhar conteúdo abaixo do status bar. */
      verticalPadding: 6,
      rowMinHeight: 36,
      edgeSlotWidth: 44,
      dividerOpacity: 0.38,
      naturalGap: 8,
    },
    content: {
      horizontalPadding: Paddings.xl,
      /** Espaço entre o divisor do header da tab e o primeiro bloco (ex.: campo de pesquisa). */
      topPaddingAfterHeader: Paddings.md,
    },
  },
} as const;

/** Compat (deprecado): preferir `Radii` */
export const Radius = {
  xs: Radii.xs,
  sm: Radii.sm,
  medium: Radii.md,
  lg: Radii.lg,
  xl: Radii.xl,
  full: Radii.full,
} as const;

export type RadiusKey = keyof typeof Radius;

/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_HORIZONTAL_PADDING = Layout.tab.header.horizontalPadding;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_CONTENT_HORIZONTAL_PADDING = Layout.tab.content.horizontalPadding;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_VERTICAL_PADDING = Layout.tab.header.verticalPadding;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_ROW_MIN_HEIGHT = Layout.tab.header.rowMinHeight;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_EDGE_SLOT_WIDTH = Layout.tab.header.edgeSlotWidth;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_DIVIDER_OPACITY = Layout.tab.header.dividerOpacity;
/** Compat (deprecado): preferir `Layout.*` */
export const TAB_SCREEN_HEADER_NATURAL_GAP = Layout.tab.header.naturalGap;

