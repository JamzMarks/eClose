import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/infrastructure/http/setup";
import type { ReactNode } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/i18n";

import { AppIntroProvider } from "@/features/app-intro";
import { AccountSetupProvider } from "@/features/account-setup";
import { AuthProvider } from "@/contexts/auth-context";
import { LocalePreferenceProvider } from "@/contexts/locale-preference-context";
import { LocationProvider } from "@/contexts/location-context";
import { ThemePreferenceProvider } from "@/contexts/theme-preference-context";
import { SplashScreenGate } from "@/components/splash/splash-screen-gate";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/layout";
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

  return (
    <ThemeProvider value={theme}>
      {children}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemePreferenceProvider>
        <LocalePreferenceProvider>
          <SafeAreaProvider>
            <LocationProvider>
              <AppIntroProvider>
                <AuthProvider>
                  <SplashScreenGate>
                    <NavigationThemeBridge>
                      <AccountSetupProvider>
                        <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="app-intro" options={{ headerShown: false }} />
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
                        <Stack.Screen
                          name="wishlists"
                          options={{
                            headerShown: false,
                            presentation: "modal",
                            contentStyle: {
                              backgroundColor: c.background,
                              borderTopLeftRadius: Radius.xl,
                              borderTopRightRadius: Radius.xl,
                              overflow: "hidden",
                            },
                          }}
                        />
                        <Stack.Screen name="create" options={{ headerShown: false }} />
                        <Stack.Screen name="notifications" options={{ headerShown: true }} />
                        <Stack.Screen name="chat-new" options={{ headerShown: true }} />
                        <Stack.Screen
                          name="settings"
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="profile-legal"
                          options={{
                            presentation: "fullScreenModal",
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="modal"
                          options={{
                            presentation: "modal",
                            title: "Modal",
                            contentStyle: {
                              backgroundColor: c.background,
                              borderTopLeftRadius: Radius.xl,
                              borderTopRightRadius: Radius.xl,
                              overflow: "hidden",
                            },
                          }}
                        />
                        </Stack>
                      </AccountSetupProvider>
                    </NavigationThemeBridge>
                  </SplashScreenGate>
                </AuthProvider>
              </AppIntroProvider>
            </LocationProvider>
          </SafeAreaProvider>
        </LocalePreferenceProvider>
      </ThemePreferenceProvider>
    </GestureHandlerRootView>
  );
}
