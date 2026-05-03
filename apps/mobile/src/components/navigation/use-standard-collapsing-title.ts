import { useCollapsingStackHeaderTitle } from "@/components/navigation/collapsing-stack-header-title";
import { minimalStackBackCircleBackground } from "@/components/navigation/minimal-stack-header";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

/**
 * Wrapper para o comportamento “header collapsing”:
 * - título grande no conteúdo
 * - título colapsado centrado no header durante scroll
 * - chrome minimal consistente (background, tint e círculo do back)
 */
export function useStandardCollapsingTitle(params: {
  navigation: { setOptions: (options: Partial<NativeStackNavigationOptions>) => void };
  title: string;
  headerTitleColor: string;
  headerBackgroundColor: string;
  tintColor: string;
  scheme: "light" | "dark";
  backAccessibilityLabel: string;
  minimalHeaderOptions?: Parameters<typeof useCollapsingStackHeaderTitle>[0]["minimalHeaderOptions"];
}) {
  return useCollapsingStackHeaderTitle({
    enabled: true,
    navigation: params.navigation,
    collapsedTitle: params.title,
    headerTitleColor: params.headerTitleColor,
    chrome: {
      headerBackgroundColor: params.headerBackgroundColor,
      tintColor: params.tintColor,
      circleBackgroundColor: minimalStackBackCircleBackground(params.scheme),
      backAccessibilityLabel: params.backAccessibilityLabel,
    },
    minimalHeaderOptions: params.minimalHeaderOptions,
  });
}

