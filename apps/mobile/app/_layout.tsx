import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/infrastructure/http/setup";
import type { ReactNode } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/i18n";

import { AuthProvider } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { SafeAreaProvider } from "react-native-safe-area-context";

function NavigationThemeBridge({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme() ?? "light";
  const c = getSchemeColors(colorScheme);
  const base = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: AppPalette.primary,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: AppPalette.error,
    },
  };

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationThemeBridge>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="event/[id]"
                options={{ headerShown: true, headerBackTitle: "Voltar" }}
              />
              <Stack.Screen
                name="venue/[id]"
                options={{ headerShown: true, headerBackTitle: "Voltar" }}
              />
              <Stack.Screen name="wishlists" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{
                  presentation: "modal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </NavigationThemeBridge>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
