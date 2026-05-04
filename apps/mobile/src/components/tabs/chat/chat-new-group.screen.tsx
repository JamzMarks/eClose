import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import {
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { ChatInlineEmpty } from "@/components/tabs/chat/chat-inline-empty";
import { ChatPlainLinkRow } from "@/components/tabs/chat/chat-plain-link-row";
import { ChatUserSuggestionRow } from "@/components/tabs/chat/chat-user-suggestion-row";
import { GroupInviteLinkModal } from "@/components/tabs/chat/group-invite-link-modal";
import { GroupSettingsModal } from "@/components/tabs/chat/group-settings-modal";
import { AppButton } from "@/components/ui/Button";
import { AppSearchField } from "@/components/ui/SearchField";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LOCAL_CHAT_NEW_MESSAGE_SUGGESTIONS } from "@/services/chat/chat.new-message-suggestions.mock";
import type { ChatNewMessageUserSuggestion } from "@/types/entities/chat.types";

function matchesUser(u: ChatNewMessageUserSuggestion, q: string): boolean {
  if (!q) return true;
  const n = q.toLowerCase();
  return (
    u.displayName.toLowerCase().includes(n) || (u.subtitle?.toLowerCase().includes(n) ?? false)
  );
}

export function ChatNewGroupScreen() {
  const { t } = useTranslation("tabs");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";
  const insets = useSafeAreaInsets();

  const [groupName, setGroupName] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const hasSelection = selectedIds.length > 0;

  useEffect(() => {
    if (!hasSelection) {
      setShowCreate(false);
      return;
    }
    const timer = setTimeout(() => setShowCreate(true), 1000);
    return () => clearTimeout(timer);
  }, [hasSelection]);

  const headerRight = useMemo(() => {
    function HeaderRight() {
      return (
        <Pressable
          onPress={() => setSettingsOpen(true)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t("chatNewGroupMoreSettings")}
          style={({ pressed }) => [
            styles.headerIconCircle,
            {
              backgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Icon name={AppIcon.Settings} size="md" color={c.text} />
        </Pressable>
      );
    }
    HeaderRight.displayName = "ChatNewGroupHeaderRight";
    return HeaderRight;
  }, [c.text, isDark, t]);

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("chatNewGroupTitle"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
    minimalHeaderOptions: { headerRight },
  });

  const filteredMembers = useMemo(() => {
    const q = memberSearch.trim();
    return LOCAL_CHAT_NEW_MESSAGE_SUGGESTIONS.filter((u) => matchesUser(u, q));
  }, [memberSearch]);

  const toggleUser = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleCreateGroup = useCallback(() => {
    const name = groupName.trim();
    if (!name) {
      Alert.alert("", t("chatNewGroupNameRequired"));
      return;
    }
    Alert.alert(t("chatNewGroupCreatedTitle"), t("chatNewGroupCreatedBody"));
  }, [groupName, t]);

  const listHeader = useCallback(
    () => (
      <View style={styles.headerBlock}>
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("chatNewGroupTitle")}
        </CollapsingStackLargeTitle>
        <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>{t("chatNewGroupNameLabel")}</Text>
        <TextInput
          value={groupName}
          onChangeText={setGroupName}
          placeholder={t("chatNewGroupNamePlaceholder")}
          placeholderTextColor={c.textMuted}
          style={[
            styles.nameInput,
            { color: c.text, borderColor: c.border, backgroundColor: c.surface },
          ]}
          accessibilityLabel={t("chatNewGroupNameA11y")}
        />
        <AppSearchField
          value={memberSearch}
          onChangeText={setMemberSearch}
          placeholder={t("chatNewGroupMemberSearchPlaceholder")}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("chatNewGroupMemberSearchA11y")}
          containerStyle={styles.search}
        />
        {selectedIds.length === 0 ? (
          <ChatPlainLinkRow
            icon={AppIcon.Share}
            title={t("chatNewGroupInviteLinkCta")}
            onPress={() => setInviteOpen(true)}
            titleColor={c.text}
            iconSize="sm"
            accentTitle
            accessibilityLabel={t("chatNewGroupInviteLinkCta")}
          />
        ) : null}
        <SettingsSectionHeader title={t("chatNewGroupMembersSection")} color={c.textSecondary} />
      </View>
    ),
    [c, collapse, groupName, memberSearch, selectedIds.length, t],
  );

  return (
    <Screen edges={["bottom"]}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: c.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const checked = selectedIds.includes(item.id);
            return (
              <ChatUserSuggestionRow
                user={item}
                textColor={c.text}
                subtitleColor={c.textSecondary}
                placeholderSurfaceColor={c.border}
                selection={checked ? "checked" : "unchecked"}
                onPress={() => toggleUser(item.id)}
              />
            );
          }}
          ListHeaderComponent={listHeader}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom:
                insets.bottom + (showCreate ? 88 : Paddings.xxl) + (showCreate ? Paddings.lg : 0),
            },
          ]}
          ListEmptyComponent={
            <ChatInlineEmpty
              message={t("chatNewGroupMembersEmpty")}
              textColor={c.textSecondary}
              backgroundColor={c.surface}
              style={{ marginTop: Paddings.sm }}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...collapsingScrollProps(collapse)}
        />
        {showCreate ? (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, Paddings.md),
                borderTopColor: c.border,
                backgroundColor: c.background,
              },
            ]}>
            <AppButton title={t("chatNewGroupCreate")} fullWidth onPress={handleCreateGroup} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
      <GroupSettingsModal visible={settingsOpen} onDismiss={() => setSettingsOpen(false)} />
      <GroupInviteLinkModal
        visible={inviteOpen}
        onDismiss={() => setInviteOpen(false)}
        groupName={groupName.trim() || t("chatNewGroupDefaultName")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  listContent: {
    paddingHorizontal: Paddings.xl,
  },
  headerBlock: {},
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: Paddings.sm,
  },
  nameInput: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radii.md,
    paddingHorizontal: Paddings.md,
    paddingVertical: Platform.select({ ios: 12, android: 10, default: 10 }),
    fontSize: 16,
    marginBottom: Paddings.lg,
  },
  search: {
    marginBottom: Paddings.md,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Paddings.xl,
    paddingTop: Paddings.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
