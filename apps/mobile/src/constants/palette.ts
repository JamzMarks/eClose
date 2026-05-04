/**
 * Identidade visual — primária laranja mais escuro, secundárias e semânticas.
 * Usar estes tokens nos componentes em vez de cores soltas.
 */
export const AppPalette = {
  primary: "#C2410C",
  primaryPressed: "#9A3412",
  primaryMuted: "#FED7AA",
  secondary: "#1E3A5F",
  secondaryPressed: "#152A45",
  accent: "#EA580C",

  success: "#15803D",
  warning: "#CA8A04",
  error: "#B91C1C",
  info: "#0369A1",

  white: "#FFFFFF",
  black: "#0F172A",

  light: {
    /** Tela base — branco; cartões/inputs usam o mesmo `surface` ou borda para separação. */
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceElevated: "#F4F4F5",
    border: "#D8D6D3",
    borderStrong: "#CAC6C1",
    text: "#1C1917",
    textSecondary: "#57534E",
    textMuted: "#A8A29E",
    tint: "#C2410C",
    icon: "#78716C",
    tabIconDefault: "#A8A29E",
    tabIconSelected: "#C2410C",
    /** Alinhado a `surface` — campos e cartões partilham o mesmo token de preenchimento. */
    inputBackground: "#FFFFFF",
    overlay: "rgba(15, 23, 42, 0.45)",
  },

  dark: {
    /** Canvas próximo do preto; `surface` um degrau acima para cartões e campos. */
    background: "#000000",
    surface: "#141312",
    surfaceElevated: "#1C1917",
    border: "#44403C",
    borderStrong: "#57534E",
    text: "#FAFAF9",
    textSecondary: "#D6D3D1",
    textMuted: "#A8A29E",
    tint: "#FB923C",
    icon: "#A8A29E",
    tabIconDefault: "#78716C",
    tabIconSelected: "#FB923C",
    /** Igual a `surface`: inputs e cartões no mesmo cinza base (borda define o limite). */
    inputBackground: "#141312",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
} as const;

export type ColorSchemeName = "light" | "dark";

export function getSchemeColors(scheme: ColorSchemeName | null | undefined) {
  return scheme === "dark" ? AppPalette.dark : AppPalette.light;
}
