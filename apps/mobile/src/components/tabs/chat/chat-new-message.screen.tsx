import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  CollapsingStackLargeTitle,
  collapsingScrollProps,
} from "@/components/navigation/collapsing-stack-header-title";
import { useStandardCollapsingTitle } from "@/components/navigation/use-standard-collapsing-title";
import { SettingsSectionHeader } from "@/components/settings/components/SettingsSectionHeader";
import { ChatUserSuggestionRow } from "@/components/tabs/chat/chat-user-suggestion-row";
import { AppSearchField } from "@/components/ui/SearchField";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
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
        <Pressable
          onPress={() => router.push("/chat-new-group")}
          style={({ pressed }) => [
            styles.createGroupCard,
            {
              borderColor: c.border,
              backgroundColor: c.surface,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("chatNewGroupCtaA11y")}>
          <View style={[styles.createIconWrap, { backgroundColor: c.inputBackground }]}>
            <Icon name={AppIcon.Create} size="md" color={AppPalette.primary} filled />
          </View>
          <View style={styles.createGroupText}>
            <Text style={[styles.createGroupTitle, { color: c.text }]}>
              {t("chatNewGroupCtaTitle")}
            </Text>
            <Text style={[styles.createGroupHint, { color: c.textSecondary }]}>
              {t("chatNewGroupCtaSubtitle")}
            </Text>
          </View>
          <Text style={[styles.chevronFwd, { color: c.textMuted }]}>›</Text>
        </Pressable>
        <SettingsSectionHeader title={t("chatNewMessageSuggestionsSection")} color={c.textSecondary} />
      </View>
    ),
    [c, collapse, router, search, t],
  );

  const empty =
    filtered.length === 0 ? (
      <View style={[styles.emptyCard, { borderColor: c.border, backgroundColor: c.surface }]}>
        <Text style={[styles.emptyText, { color: c.textSecondary }]}>
          {t("chatNewMessageEmpty")}
        </Text>
      </View>
    ) : null;

  return (
    <Screen edges={["bottom"]}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: c.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ChatUserSuggestionRow
              user={item}
              textColor={c.text}
              subtitleColor={c.textSecondary}
              borderColor={c.border}
              showDivider={index < filtered.length - 1}
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
    marginBottom: Paddings.lg,
  },
  createGroupCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Paddings.md,
    paddingHorizontal: Paddings.lg,
    marginBottom: Paddings.xl,
    gap: Paddings.md,
  },
  createIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  createGroupText: {
    flex: 1,
    minWidth: 0,
  },
  createGroupTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  createGroupHint: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyCard: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Paddings.xl,
    paddingHorizontal: Paddings.lg,
    marginTop: Paddings.sm,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  chevronFwd: {
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },
});
