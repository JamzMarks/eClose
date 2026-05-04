import { useMemo, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthRequiredPlaceholder } from "@/components/auth";
import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { TabHeaderSettingsButton } from "@/components/shared/tab-screen/TabHeaderChrome";
import { ProfileAchievementsSection } from "@/components/tabs/profile/components/ProfileAchievementsSection";
import { ProfileAvatarModal } from "@/components/tabs/profile/components/ProfileAvatarModal";
import { ProfileCompletenessBar } from "@/components/tabs/profile/components/ProfileCompletenessBar";
import { ProfileEditDraftSheet } from "@/components/tabs/profile/components/ProfileEditDraftSheet";
import { ProfileIdentityBlock } from "@/components/tabs/profile/components/ProfileIdentityBlock";
import {
  ProfileMediaTabStrip,
  type ProfileContentTab,
} from "@/components/tabs/profile/components/ProfileMediaTabStrip";
import { ProfileMyCalendarPreview } from "@/components/tabs/profile/components/ProfileMyCalendarPreview";
import { ProfileSavedVenuesPreview } from "@/components/tabs/profile/components/ProfileSavedVenuesPreview";
import {
  displayNameFromEmail,
  handleFromEmail,
} from "@/components/tabs/profile/utils/email-handle";
import { getSchemeColors } from "@/constants/palette";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProfileUiDraft } from "@/hooks/use-profile-ui-draft";
import { profileCompletenessPercent } from "@/lib/profile-completeness";

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
  const { draft, setDraft, updateDraft } = useProfileUiDraft();
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [profileContentTab, setProfileContentTab] = useState<ProfileContentTab>("calendar");

  const handle = useMemo(() => handleFromEmail(user?.email), [user?.email]);
  const profileUsername = useMemo(() => {
    const u = user?.username?.trim();
    if (u) return u;
    return displayNameFromEmail(user?.email, t("nameFallback"));
  }, [user?.username, user?.email, t]);

  const completeness = useMemo(() => profileCompletenessPercent(draft), [draft]);
  const customAvatarUri = useMemo(() => {
    if (draft.useCustomAvatar && draft.customAvatarUri?.trim()) {
      return draft.customAvatarUri.trim();
    }
    return null;
  }, [draft.useCustomAvatar, draft.customAvatarUri]);

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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ProfileIdentityBlock
            avatarSeed={user?.id ?? handle}
            displayName={profileUsername}
            handle={handle}
            customAvatarUri={customAvatarUri}
            cityLabel={draft.city.trim() || null}
            bio={draft.bio.trim() || null}
            borderColor={c.borderStrong}
            surfaceColor={c.surface}
            textColor={c.text}
            mutedColor={c.textSecondary}
            onPressAvatar={() => {
              Keyboard.dismiss();
              setAvatarModalOpen(true);
            }}
            photoAccessibilityLabel={t("profilePhotoEditA11y")}
          />
          <ProfileCompletenessBar
            style={styles.completenessBelowBio}
            percent={completeness}
            borderColor={c.border}
            surfaceColor={c.surface}
            textColor={c.text}
            mutedColor={c.textSecondary}
            onPressEdit={() => {
              Keyboard.dismiss();
              setEditSheetOpen(true);
            }}
          />
          <ProfileMediaTabStrip
            activeTab={profileContentTab}
            onTabChange={setProfileContentTab}
            textColor={c.text}
            mutedColor={c.textMuted}
            borderColor={c.border}
          />
          {profileContentTab === "calendar" ? (
            <ProfileMyCalendarPreview
              textColor={c.text}
              subtitleColor={c.textSecondary}
              mutedColor={c.textMuted}
              borderColor={c.border}
              surfaceColor={c.surface}
              chipBorderColor={c.borderStrong}
            />
          ) : null}
          {profileContentTab === "places" ? (
            <ProfileSavedVenuesPreview
              textColor={c.text}
              subtitleColor={c.textSecondary}
              borderColor={c.border}
              surfaceColor={c.surface}
            />
          ) : null}
          {profileContentTab === "achievements" ? (
            <ProfileAchievementsSection
              draft={draft}
              textColor={c.text}
              subtitleColor={c.textSecondary}
              borderColor={c.border}
              surfaceColor={c.surface}
            />
          ) : null}
        </ScrollView>
      </TabScreenContent>
      <ProfileEditDraftSheet
        visible={editSheetOpen}
        draft={draft}
        onClose={() => setEditSheetOpen(false)}
        onApply={setDraft}
      />
      <ProfileAvatarModal
        visible={avatarModalOpen}
        draft={draft}
        avatarSeed={user?.id ?? handle}
        onClose={() => setAvatarModalOpen(false)}
        onSave={(patch) => updateDraft(patch)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  completenessBelowBio: {
    marginTop: 22,
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 12,
  },
});
