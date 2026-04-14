import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Paddings, Radii } from "@/constants/layout";
import { AppPalette } from "@/constants/palette";
import type { MyCalendarSavedEvent } from "@/services/my-calendar/my-calendar.types";
import {
  eventCountByLocalDayKey,
  isTodayLocal,
  localDayKey,
  rollingLocalDaysFromToday,
} from "@/services/my-calendar/my-calendar.utils";

const DAY_CELL_WIDTH = 58;

export type ProfileMyCalendarWeekStripProps = {
  events: MyCalendarSavedEvent[];
  locale: string;
  textColor: string;
  mutedColor: string;
  surfaceColor: string;
  borderColor: string;
  /** Chave `localDayKey` do dia selecionado (lista de eventos em sincronia). */
  selectedDayKey: string;
  todayLabel: string;
  onSelectDay: (dayKey: string) => void;
  dayA11yWithEvents: (parts: { weekdayLong: string; dayNum: number; count: number }) => string;
  dayA11yNoEvents: (parts: { weekdayLong: string; dayNum: number }) => string;
  /** Sem caixa própria: útil dentro de um cartão já com borda. */
  embedded?: boolean;
};

export function ProfileMyCalendarWeekStrip({
  events,
  locale,
  textColor,
  mutedColor,
  surfaceColor,
  borderColor,
  selectedDayKey,
  todayLabel,
  onSelectDay,
  dayA11yWithEvents,
  dayA11yNoEvents,
  embedded = false,
}: ProfileMyCalendarWeekStripProps) {
  const days = rollingLocalDaysFromToday(7);
  const counts = eventCountByLocalDayKey(events);

  return (
    <View
      style={[
        styles.wrap,
        embedded ? styles.wrapEmbedded : { borderColor, backgroundColor: surfaceColor },
      ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.rowScroll}>
        {days.map((d) => {
          const key = localDayKey(d);
          const n = counts.get(key) ?? 0;
          const today = isTodayLocal(d);
          const selected = key === selectedDayKey;
          const weekdayShort = d.toLocaleDateString(locale, { weekday: "short" });
          const weekdayLong = d.toLocaleDateString(locale, { weekday: "long" });
          const dayNum = d.getDate();
          const a11y =
            n > 0
              ? dayA11yWithEvents({ weekdayLong, dayNum, count: n })
              : dayA11yNoEvents({ weekdayLong, dayNum });

          return (
            <Pressable
              key={key}
              onPress={() => onSelectDay(key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={a11y}
              style={({ pressed }) => [
                styles.cell,
                selected && styles.cellSelected,
                !selected &&
                  today && {
                    borderColor: AppPalette.primary,
                    borderWidth: StyleSheet.hairlineWidth * 2,
                    backgroundColor: "transparent",
                  },
                !selected &&
                  !today && {
                    borderColor,
                    backgroundColor: "transparent",
                  },
                pressed && { opacity: 0.88 },
              ]}>
              <Text
                style={[
                  styles.weekday,
                  { color: selected || today ? AppPalette.primary : mutedColor },
                ]}
                numberOfLines={1}>
                {weekdayShort}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  { color: selected || today ? AppPalette.primary : textColor },
                ]}>
                {dayNum}
              </Text>
              {today ? (
                <Text style={[styles.todayTag, { color: AppPalette.primary }]} numberOfLines={1}>
                  {todayLabel}
                </Text>
              ) : (
                <View style={styles.todayTagPlaceholder} />
              )}
              <View style={styles.countRow}>
                {n > 0 ? (
                  <View style={[styles.countBadge, { backgroundColor: AppPalette.primary }]}>
                    <Text style={styles.countText}>{n > 9 ? "9+" : String(n)}</Text>
                  </View>
                ) : (
                  <View style={styles.countPlaceholder} />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Paddings.sm,
  },
  wrapEmbedded: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: Paddings.xs,
  },
  rowScroll: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Paddings.sm,
    paddingRight: Paddings.xs,
  },
  cell: {
    width: DAY_CELL_WIDTH,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingVertical: Paddings.sm,
    paddingHorizontal: Paddings.xs,
    minHeight: 96,
  },
  cellSelected: {
    borderColor: AppPalette.primary,
    borderWidth: 2,
    backgroundColor: AppPalette.primaryMuted,
  },
  weekday: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 19,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  todayTag: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    textTransform: "capitalize",
  },
  todayTagPlaceholder: {
    height: 15,
    marginTop: 4,
  },
  countRow: {
    height: 18,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    fontVariant: ["tabular-nums"],
  },
  countPlaceholder: {
    width: 18,
    height: 18,
  },
});
