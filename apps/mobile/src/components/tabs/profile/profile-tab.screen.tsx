import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { TabHeaderSettingsButton } from "@/components/shared/tab-screen/TabHeaderChrome";
import { ProfileIdentityBlock } from "@/components/tabs/profile/components/ProfileIdentityBlock";
import {
  displayNameFromEmail,
  handleFromEmail,
} from "@/components/tabs/profile/utils/email-handle";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Tab Perfil: identidade (@handle, avatar, nome, email). Opções em ⚙️ → modal de definições.
 */
export function ProfileTabScreen() {
  const { t } = useTranslation("profile");
  const { t: tAuth } = useTranslation("auth");
  const { t: tTabs } = useTranslation("tabs");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { isReady, isSignedIn, user } = useAuth();
  const handle = useMemo(() => handleFromEmail(user?.email), [user?.email]);
  const profileUsername = useMemo(() => {
    const u = user?.username?.trim();
    if (u) return u;
    return displayNameFromEmail(user?.email, t("nameFallback"));
  }, [user?.username, user?.email, t]);

  if (!isReady) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <Screen>
        <AppTabScreenHeader title={tTabs("profile")} borderColor={c.border} titleColor={c.text} />
        <TabScreenContent style={{ flex: 1 }}>
          <AuthRequiredPlaceholder message={tAuth("authRequiredProfileBody")} insetFromParent />
        </TabScreenContent>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppTabScreenHeader
        title={tTabs("profile")}
        borderColor={c.border}
        titleColor={c.text}
        trailing={<TabHeaderSettingsButton color={c.text} />}
      />
      <TabScreenContent style={{ flex: 1 }}>
        <ScrollView
          style={[styles.scroll, { backgroundColor: c.background }]}
          contentContainerStyle={[{ paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}>
          <ProfileIdentityBlock
            avatarSeed={user?.id ?? handle}
            displayName={profileUsername}
            handle={handle}
            email={user?.email ?? "—"}
            borderColor={c.borderStrong}
            surfaceColor={c.surface}
            textColor={c.text}
            mutedColor={c.textSecondary}
          />
        </ScrollView>
      </TabScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
});
