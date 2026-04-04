import { useMemo } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/screen";
import { ProfileEditProfileButton } from "@/components/tabs/profile/components/ProfileEditProfileButton";
import { ProfileHeaderBlock } from "@/components/tabs/profile/components/ProfileHeaderBlock";
import { ProfileMediaTabStrip } from "@/components/tabs/profile/components/ProfileMediaTabStrip";
import { ProfilePostsPlaceholderGrid } from "@/components/tabs/profile/components/ProfilePostsPlaceholderGrid";
import { ProfileTopBar } from "@/components/tabs/profile/components/ProfileTopBar";
import {
  displayNameFromEmail,
  handleFromEmail,
} from "@/components/tabs/profile/utils/email-handle";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Orquestra o perfil: definições via modal (`/settings`); UI em subcomponentes da tab.
 */
export function ProfileTabScreen() {
  const { t } = useTranslation("profile");
  const { t: tSettings } = useTranslation("settings");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { user } = useAuth();

  const handle = useMemo(() => handleFromEmail(user?.email), [user?.email]);
  const profileUsername = useMemo(() => {
    const u = user?.username?.trim();
    if (u) return u;
    return displayNameFromEmail(user?.email, t("nameFallback"));
  }, [user?.username, user?.email, t]);

  const editBg = scheme === "dark" ? c.surfaceElevated : "#EFEFEF";

  return (
    <Screen>
      <ScrollView
        style={[styles.scroll, { backgroundColor: c.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileTopBar
          handle={handle}
          textColor={c.text}
          borderColor={c.border}
          settingsA11yLabel={tSettings("openSettingsA11y")}
          onOpenSettings={() => router.push("/settings")}
        />

        <ProfileHeaderBlock
          avatarSeed={user?.id ?? handle}
          borderColor={c.borderStrong}
          surfaceColor={c.surface}
          textColor={c.text}
          mutedColor={c.textSecondary}
          stats={{ posts: "0", followers: "0", following: "0" }}
          labels={{
            posts: t("posts"),
            followers: t("followers"),
            following: t("following"),
          }}
        />

        <Text style={[styles.displayName, { color: c.text }]}>{profileUsername}</Text>
        <Text style={[styles.bio, { color: c.text }]}>{t("bioPlaceholder")}</Text>

        <ProfileEditProfileButton
          label={t("editProfile")}
          textColor={c.text}
          backgroundColor={editBg}
          borderColor={c.border}
          onPress={() => {}}
        />

        <ProfileMediaTabStrip
          textColor={c.text}
          mutedColor={c.textMuted}
          borderColor={c.border}
        />

        <ProfilePostsPlaceholderGrid
          surfaceColor={c.surface}
          borderColor={c.border}
          emptyHint={t("emptyPosts")}
          hintColor={c.textMuted}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  displayName: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
