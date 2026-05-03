import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette } from "@/constants/palette";
import type { MyCalendarSavedEvent } from "@/types/entities/my-calendar.types";
import type { CalendarCell } from "@/services/my-calendar/my-calendar.utils";
import {
  buildMonthGrid,
  eventCountByLocalDayKey,
  isTodayLocal,
  localDayKey,
} from "@/services/my-calendar/my-calendar.utils";

export type MyCalendarMonthGridProps = {
  year: number;
  month: number;
  /** Chaves `localDayKey` dos dias selecionados (seleção múltipla). */
  selectedDayKeys: readonly string[];
  onToggleDay: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  events: MyCalendarSavedEvent[];
  locale: string;
  /** 0 = domingo, 1 = segunda */
  weekStartsOn?: 0 | 1;
  textColor: string;
  subtitleColor: string;
  mutedColor: string;
  surfaceColor: string;
  borderColor: string;
  prevA11y: string;
  nextA11y: string;
};

function chunkWeeks(cells: CalendarCell[]) {
  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function weekdayShortLabels(locale: string, weekStartsOn: 0 | 1): string[] {
  const labels: string[] = [];
  const refMonday = new Date(2024, 0, 1);
  const refSunday = new Date(2024, 0, 7);
  const ref = weekStartsOn === 1 ? refMonday : refSunday;
  for (let i = 0; i < 7; i++) {
    const d = new Date(ref);
    d.setDate(ref.getDate() + i);
    labels.push(d.toLocaleDateString(locale, { weekday: "short" }));
  }
  return labels;
}

export function MyCalendarMonthGrid({
  year,
  month,
  selectedDayKeys,
  onToggleDay,
  onPrevMonth,
  onNextMonth,
  events,
  locale,
  weekStartsOn = 1,
  textColor,
  subtitleColor,
  mutedColor,
  surfaceColor,
  borderColor,
  prevA11y,
  nextA11y,
}: MyCalendarMonthGridProps) {
  const grid = buildMonthGrid(year, month, weekStartsOn);
  const counts = eventCountByLocalDayKey(events);
  const weekdays = weekdayShortLabels(locale, weekStartsOn);
  const monthTitle = new Date(year, month, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={[styles.wrap, { borderColor, backgroundColor: surfaceColor }]}>
      <View style={styles.monthRow}>
        <Pressable
          onPress={onPrevMonth}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={prevA11y}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}>
          <Icon name={AppIcon.ChevronLeft} size="md" color={textColor} />
        </Pressable>
        <Text style={[styles.monthTitle, { color: textColor }]} accessibilityRole="header">
          {monthTitle}
        </Text>
        <Pressable
          onPress={onNextMonth}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={nextA11y}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.chevronFlip}>
            <Icon name={AppIcon.ChevronLeft} size="md" color={textColor} />
          </View>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {weekdays.map((w, i) => (
          <Text key={i} style={[styles.weekdayCell, { color: mutedColor }]} numberOfLines={1}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {chunkWeeks(grid).map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((cell, idx) => {
              const cellKey = cell.kind === "pad" ? `pad-${wi}-${idx}` : localDayKey(cell.date);
              if (cell.kind === "pad") {
                return <View key={cellKey} style={styles.dayCell} />;
              }
              const d = cell.date;
              const key = localDayKey(d);
              const n = counts.get(key) ?? 0;
              const selected = selectedDayKeys.includes(key);
              const today = isTodayLocal(d);

              return (
                <Pressable
                  key={key}
                  onPress={() => onToggleDay(d)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${d.getDate()}`}
                  style={({ pressed }) => [
                    styles.dayCell,
                    styles.dayCellInner,
                    today && {
                      borderWidth: StyleSheet.hairlineWidth * 2,
                      borderColor: AppPalette.primary,
                    },
                    selected && { backgroundColor: AppPalette.primaryMuted },
                    pressed && { opacity: 0.88 },
                  ]}>
                  <Text
                    style={[
                      styles.dayNum,
                      { color: selected ? AppPalette.primary : textColor },
                    ]}>
                    {d.getDate()}
                  </Text>
                  {n > 0 ? (
                    <View style={styles.dots}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: selected ? AppPalette.primary : subtitleColor },
                        ]}
                      />
                    </View>
                  ) : (
                    <View style={styles.dotPlaceholder} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Paddings.md,
    marginBottom: Paddings.md,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Paddings.md,
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
    flex: 1,
    textAlign: "center",
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronFlip: {
    transform: [{ rotate: "180deg" }],
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: Paddings.sm,
  },
  weekdayCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    gap: 0,
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 52,
    padding: 2,
  },
  dayCellInner: {
    borderRadius: Radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNum: {
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  dots: {
    height: 6,
    justifyContent: "center",
    marginTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
  },
  dotPlaceholder: {
    height: 6,
    marginTop: 2,
  },
});
