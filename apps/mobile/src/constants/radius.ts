/**
 * Border-radius da app — preferir estes tokens a valores soltos.
 * Cards de listagem: `medium` (amigável, consistente em iOS/Android).
 */
export const Radius = {
  /** Chips, inputs compactos */
  xs: 6,
  /** Botões pequenos, tags */
  sm: 10,
  /** Cards de lista, modais leves */
  medium: 14,
  /** Cartões hero, sheets */
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof Radius;
