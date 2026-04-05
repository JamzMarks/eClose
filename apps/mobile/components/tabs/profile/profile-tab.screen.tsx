import { useMemo } from "react";
import { Alert, Linking, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

import { Screen } from "@/components/layout/screen";
import { ProfileIdentityBlock } from "@/components/tabs/profile/components/ProfileIdentityBlock";
import { ProfileTopBar } from "@/components/tabs/profile/components/ProfileTopBar";
import {
  displayNameFromEmail,
  handleFromEmail,
} from "@/components/tabs/profile/utils/email-handle";
import { SettingsNavigationRow } from "@/components/settings/components/SettingsNavigationRow";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { getLegalUrls } from "@/constants/legal-urls";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

async function openUrl(url: string): Promise<void> {
  const can = await Linking.canOpenURL(url);
  if (can) {
    await WebBrowser.openBrowserAsync(url);
  }
}

/**
 * Perfil MVP: identidade mínima, listas partilhadas, definições, legais e terminar sessão.
 */
export function ProfileTabScreen() {
  const { t } = useTranslation("profile");
  const { t: tSettings } = useTranslation("settings");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { user, signOut } = useAuth();
  const legal = useMemo(() => getLegalUrls(), []);

  const handle = useMemo(() => handleFromEmail(user?.email), [user?.email]);
  const profileUsername = useMemo(() => {
    const u = user?.username?.trim();
    if (u) return u;
    return displayNameFromEmail(user?.email, t("nameFallback"));
  }, [user?.username, user?.email, t]);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  function confirmSignOut() {
    Alert.alert(tSettings("signOutConfirmTitle"), tSettings("signOutConfirmMessage"), [
      { text: tSettings("cancel"), style: "cancel" },
      {
        text: tSettings("signOutConfirmAction"),
        style: "destructive",
        onPress: () => void handleSignOut(),
      },
    ]);
  }

  return (
    <Screen>
      <ScrollView
        style={[styles.scroll, { backgroundColor: c.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <ProfileTopBar
          handle={handle}
          textColor={c.text}
          borderColor={c.border}
          settingsA11yLabel={tSettings("openSettingsA11y")}
          onOpenSettings={() => router.push("/settings")}
        />

        <ProfileIdentityBlock
          avatarSeed={user?.id ?? handle}
          displayName={profileUsername}
          email={user?.email ?? "—"}
          borderColor={c.borderStrong}
          surfaceColor={c.surface}
          textColor={c.text}
          mutedColor={c.textSecondary}
        />

        <SettingsSectionHeader title={t("sectionLists")} color={c.textMuted} />
        <SettingsNavigationRow
          title={t("sharedWishlists")}
          subtitle={t("sharedWishlistsHint")}
          onPress={() => router.push("/wishlists")}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionAccount")} color={c.textMuted} />
        <SettingsNavigationRow
          title={tSettings("title")}
          subtitle={t("openSettingsHint")}
          onPress={() => router.push("/settings")}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={t("sectionLegal")} color={c.textMuted} />
        <SettingsNavigationRow
          title={t("privacyPolicy")}
          onPress={() => void openUrl(legal.privacyPolicyUrl)}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("termsOfService")}
          onPress={() => void openUrl(legal.termsOfServiceUrl)}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />
        <SettingsNavigationRow
          title={t("helpContact")}
          onPress={() => void Linking.openURL(legal.helpMailto)}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
        />

        <SettingsSectionHeader title={tSettings("sectionSession")} color={c.textMuted} />
        <SettingsNavigationRow
          title={tSettings("signOut")}
          onPress={confirmSignOut}
          textColor={c.text}
          subtitleColor={c.textMuted}
          borderColor={c.border}
          backgroundColor={c.surface}
          destructive
          showChevron={false}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
});
