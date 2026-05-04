import { useCallback, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { ChatInlineEmpty } from "@/components/tabs/chat/chat-inline-empty";
import { ChatPlainLinkRow } from "@/components/tabs/chat/chat-plain-link-row";
import { ChatUserSuggestionRow } from "@/components/tabs/chat/chat-user-suggestion-row";
import { AppSearchField } from "@/components/ui/SearchField";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings } from "@/constants/layout";
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

export function ChatNewMessageScreen() {
  const { t } = useTranslation("tabs");
  const { t: tCommon } = useTranslation("common");
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";
  const [search, setSearch] = useState("");

  const collapse = useStandardCollapsingTitle({
    navigation,
    title: t("chatNewMessageTitle"),
    headerTitleColor: c.text,
    headerBackgroundColor: c.background,
    tintColor: c.text,
    scheme: isDark ? "dark" : "light",
    backAccessibilityLabel: tCommon("backA11y"),
  });

  const filtered = useMemo(() => {
    const q = search.trim();
    return LOCAL_CHAT_NEW_MESSAGE_SUGGESTIONS.filter((u) => matchesUser(u, q));
  }, [search]);

  const listHeader = useCallback(
    () => (
      <View style={styles.headerBlock}>
        <CollapsingStackLargeTitle color={c.text} collapse={collapse}>
          {t("chatNewMessageTitle")}
        </CollapsingStackLargeTitle>
        <AppSearchField
          value={search}
          onChangeText={setSearch}
          placeholder={t("chatNewMessageSearchPlaceholder")}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={t("chatNewMessageSearchA11y")}
          containerStyle={styles.search}
        />
        <ChatPlainLinkRow
          icon={AppIcon.Create}
          title={t("chatNewGroupCtaTitle")}
          onPress={() => router.push("/chat-new-group")}
          titleColor={c.text}
          mutedColor={c.textMuted}
          iconFilled
          showChevron
          accessibilityLabel={t("chatNewGroupCtaA11y")}
        />
        <SettingsSectionHeader title={t("chatNewMessageSuggestionsSection")} color={c.textSecondary} />
      </View>
    ),
    [c, collapse, router, search, t],
  );

  const empty =
    filtered.length === 0 ? (
      <ChatInlineEmpty
        message={t("chatNewMessageEmpty")}
        textColor={c.textSecondary}
        backgroundColor={c.surface}
        style={{ marginTop: Paddings.sm }}
      />
    ) : null;

  return (
    <Screen edges={["bottom"]}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: c.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatUserSuggestionRow
              user={item}
              textColor={c.text}
              subtitleColor={c.textSecondary}
              placeholderSurfaceColor={c.border}
              onPress={() => undefined}
            />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={empty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...collapsingScrollProps(collapse)}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  listContent: {
    paddingHorizontal: Paddings.xl,
    paddingBottom: Paddings.xxl,
  },
  headerBlock: {
    paddingTop: 0,
  },
  search: {
    marginBottom: Paddings.md,
  },
});
