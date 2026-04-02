/**
 * Tema da app — cores por modo + fontes.
 * `Colors` mantém compatibilidade com tabs/navegação existente.
 */

import { Platform } from "react-native";
import { AppPalette, getSchemeColors, type ColorSchemeName } from "./palette";

export const Colors = {
  light: {
    text: AppPalette.light.text,
    background: AppPalette.light.background,
    tint: AppPalette.light.tint,
    icon: AppPalette.light.icon,
    tabIconDefault: AppPalette.light.tabIconDefault,
    tabIconSelected: AppPalette.light.tabIconSelected,
  },
  dark: {
    text: AppPalette.dark.text,
    background: AppPalette.dark.background,
    tint: AppPalette.dark.tint,
    icon: AppPalette.dark.icon,
    tabIconDefault: AppPalette.dark.tabIconDefault,
    tabIconSelected: AppPalette.dark.tabIconSelected,
  },
};

/** Tokens completos para novos ecrãs e componentes UI. */
export function useAppTheme(scheme: ColorSchemeName | null | undefined) {
  const c = getSchemeColors(scheme);
  return {
    scheme: scheme === "dark" ? "dark" : "light",
    colors: c,
    palette: AppPalette,
  };
}

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
