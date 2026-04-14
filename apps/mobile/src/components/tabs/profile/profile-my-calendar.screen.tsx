import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import {
  buildMinimalStackHeaderOptions,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { StackContentPageTitle } from "@/components/navigation/StackContentPageTitle";
import { MyCalendarEventRow } from "@/components/tabs/profile/components/MyCalendarEventRow";
import { MyCalendarMonthGrid } from "@/components/tabs/profile/components/MyCalendarMonthGrid";
import { Layout, Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LOCAL_MY_CALENDAR_EVENTS } from "@/services/my-calendar/my-calendar.local-data";
import type {
  MyCalendarFilterId,
  MyCalendarSavedEvent,
} from "@/services/my-calendar/my-calendar.types";
import {
  applySourceFilter,
  eventsInLocalMonth,
  eventsOnLocalDayKeys,
  localDayKey,
  parseLocalDayKey,
} from "@/services/my-calendar/my-calendar.utils";

const FILTERS: MyCalendarFilterId[] = ["all", "mine", "group", "direct"];

function filterLabel(id: MyCalendarFilterId, t: (k: string) => string): string {
  switch (id) {
    case "all":
      return t("myCalendarFilterAll");
    case "mine":
      return t("myCalendarFilterMine");
    case "group":
      return t("myCalendarFilterGroup");
    case "direct":
      return t("myCalendarFilterDirect");
    default:
      return id;
  }
}

function sourceLabelFor(row: MyCalendarSavedEvent, t: (k: string) => string): string {
  switch (row.source) {
    case "mine":
      return t("myCalendarSourceMine");
    case "group":
      return t("myCalendarSourceGroup");
    case "direct":
      return t("myCalendarSourceDirect");
    default:
      return row.source;
  }
}

export function ProfileMyCalendarScreen() {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const { t: tDiscover } = useTranslation("discover");
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";
  const locale = i18n.language?.startsWith("en") ? "en-GB" : "pt-PT";

  const [calendarFilter, setCalendarFilter] = useState<MyCalendarFilterId>("all");
  const [monthYear, setMonthYear] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [selectedDayKeys, setSelectedDayKeys] = useState<string[]>([]);

  const rawFocusDay = useLocalSearchParams<{ focusDay?: string | string[] }>().focusDay;
  const focusDayParam = Array.isArray(rawFocusDay) ? rawFocusDay[0] : rawFocusDay;

  useEffect(() => {
    if (!focusDayParam || typeof focusDayParam !== "string") return;
    const parsed = parseLocalDayKey(focusDayParam);
    if (!parsed) return;
    setMonthYear({ year: parsed.year, month: parsed.month });
    setSelectedDayKeys([focusDayParam]);
  }, [focusDayParam]);

  const goPrevMonth = useCallback(() => {
    setSelectedDayKeys([]);
    setMonthYear((prev) => {
      const next = new Date(prev.year, prev.month - 1, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setSelectedDayKeys([]);
    setMonthYear((prev) => {
      const next = new Date(prev.year, prev.month + 1, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }, []);

  const filteredEvents = useMemo(
    () => applySourceFilter(LOCAL_MY_CALENDAR_EVENTS, calendarFilter),
    [calendarFilter],
  );

  const listEvents = useMemo(() => {
    if (selectedDayKeys.length === 0) {
      return eventsInLocalMonth(filteredEvents, monthYear.year, monthYear.month);
    }
    return eventsOnLocalDayKeys(filteredEvents, selectedDayKeys);
  }, [filteredEvents, monthYear.year, monthYear.month, selectedDayKeys]);

  const toggleDay = useCallback((d: Date) => {
    const k = localDayKey(d);
    setSelectedDayKeys((prev) => {
      if (prev.includes(k)) {
        return prev.filter((x) => x !== k);
      }
      return [...prev, k].sort();
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDayKeys([]);
  }, []);

  const monthTitleLong = useMemo(
    () =>
      new Date(monthYear.year, monthYear.month, 1).toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      }),
    [monthYear.year, monthYear.month, locale],
  );

  const listSectionTitle = useMemo(() => {
    if (selectedDayKeys.length === 0) {
      return t("myCalendarMonthSection", { month: monthTitleLong });
    }
    if (selectedDayKeys.length === 1) {
      const [only] = selectedDayKeys;
      const [y, m, day] = only.split("-").map(Number);
      const d = new Date(y!, m!, day!);
      return t("myCalendarDaySection", {
        date: d.toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      });
    }
    return t("myCalendarMultiDaySection", { count: selectedDayKeys.length });
  }, [selectedDayKeys, monthTitleLong, locale, t]);

  useLayoutEffect(() => {
    navigation.setOptions(
      buildMinimalStackHeaderOptions({
        headerBackgroundColor: c.background,
        tintColor: c.text,
        circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
        backAccessibilityLabel: tCommon("backA11y"),
      }),
    );
  }, [navigation, c.background, c.text, isDark, tCommon]);

  const renderListHeader = useCallback(
    () => (
      <View style={styles.headerBlock}>
        <StackContentPageTitle color={c.text}>{t("myCalendarTitle")}</StackContentPageTitle>
        <Text style={[styles.lead, { color: c.textSecondary }]}>{t("myCalendarScreenHint")}</Text>

        <MyCalendarMonthGrid
          year={monthYear.year}
          month={monthYear.month}
          selectedDayKeys={selectedDayKeys}
          onToggleDay={toggleDay}
          onPrevMonth={goPrevMonth}
          onNextMonth={goNextMonth}
          events={filteredEvents}
          locale={locale}
          weekStartsOn={1}
          textColor={c.text}
          subtitleColor={c.textSecondary}
          mutedColor={c.textMuted}
          surfaceColor={c.surface}
          borderColor={c.border}
          prevA11y={t("myCalendarPrevMonthA11y")}
          nextA11y={t("myCalendarNextMonthA11y")}
        />

        {selectedDayKeys.length > 0 ? (
          <Pressable
            onPress={clearSelection}
            accessibilityRole="button"
            accessibilityLabel={t("myCalendarClearSelectionA11y")}
            style={styles.clearBtn}>
            <Text style={[styles.clearBtnText, { color: AppPalette.primary }]}>
              {t("myCalendarClearSelection")}
            </Text>
          </Pressable>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          keyboardShouldPersistTaps="handled">
          {FILTERS.map((id) => {
            const active = calendarFilter === id;
            return (
              <Pressable
                key={id}
                onPress={() => setCalendarFilter(id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? AppPalette.primary : c.border,
                    backgroundColor: active ? AppPalette.primaryMuted : c.background,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipLabel,
                    { color: active ? AppPalette.primary : c.text },
                  ]}>
                  {filterLabel(id, t)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.daySectionTitle, { color: c.text }]}>{listSectionTitle}</Text>
      </View>
    ),
    [
      c.text,
      c.textSecondary,
      c.textMuted,
      c.surface,
      c.border,
      c.background,
      t,
      monthYear.year,
      monthYear.month,
      selectedDayKeys,
      filteredEvents,
      locale,
      calendarFilter,
      goPrevMonth,
      goNextMonth,
      toggleDay,
      clearSelection,
      listSectionTitle,
    ],
  );

  const emptyMessage =
    selectedDayKeys.length === 0 ? t("myCalendarEmptyMonth") : t("myCalendarEmptyDay");

  return (
    <Screen edges={["bottom"]}>
      <FlatList
        data={listEvents}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: c.textSecondary }]}>{emptyMessage}</Text>
        }
        renderItem={({ item }) => (
          <MyCalendarEventRow
            row={item}
            sourceLabel={sourceLabelFor(item, t)}
            textColor={c.text}
            subtitleColor={c.textSecondary}
            mutedColor={c.textMuted}
            borderColor={c.border}
            surfaceColor={c.surface}
            chipBorderColor={c.borderStrong}
            onlineLabel={tDiscover("online")}
            onPress={() => router.push(`/event/${encodeURIComponent(item.eventId)}`)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  headerBlock: {
    paddingTop: 0,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Paddings.md,
  },
  clearBtn: {
    alignSelf: "flex-start",
    marginBottom: Paddings.sm,
    paddingVertical: Paddings.xs,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chipsRow: {
    flexDirection: "row",
    gap: Paddings.sm,
    paddingBottom: Paddings.md,
  },
  chip: {
    paddingVertical: Paddings.sm,
    paddingHorizontal: Paddings.md,
    borderRadius: Radii.full,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  daySectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Paddings.sm,
    textTransform: "capitalize",
  },
  listContent: {
    paddingBottom: Paddings.xxl,
    gap: Paddings.md,
    paddingHorizontal: Layout.tab.content.horizontalPadding,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: Paddings.md,
  },
});
