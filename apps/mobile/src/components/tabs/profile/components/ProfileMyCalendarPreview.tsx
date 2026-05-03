import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { MyCalendarEventRow } from "@/components/tabs/profile/components/MyCalendarEventRow";
import { ProfileMyCalendarWeekStrip } from "@/components/tabs/profile/components/ProfileMyCalendarWeekStrip";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LOCAL_MY_CALENDAR_EVENTS } from "@/services/my-calendar/my-calendar.local-data";
import type { MyCalendarSavedEvent } from "@/types/entities/my-calendar.types";
import {
  dateFromLocalDayKey,
  eventsOnLocalDay,
  localDayKey,
} from "@/services/my-calendar/my-calendar.utils";

export type ProfileMyCalendarPreviewProps = {
  textColor: string;
  subtitleColor: string;
  mutedColor: string;
  borderColor: string;
  surfaceColor: string;
  chipBorderColor: string;
};

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

export function ProfileMyCalendarPreview({
  textColor,
  subtitleColor,
  mutedColor,
  borderColor,
  surfaceColor,
  chipBorderColor,
}: ProfileMyCalendarPreviewProps) {
  const { t } = useTranslation("profile");
  const { t: tDiscover } = useTranslation("discover");
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const locale = i18n.language?.startsWith("en") ? "en-GB" : "pt-PT";

  const [selectedDayKey, setSelectedDayKey] = useState(() => localDayKey(new Date()));

  const selectedDate = useMemo(() => {
    return dateFromLocalDayKey(selectedDayKey) ?? new Date();
  }, [selectedDayKey]);

  const dayEvents = useMemo(
    () => eventsOnLocalDay(LOCAL_MY_CALENDAR_EVENTS, selectedDate),
    [selectedDate],
  );

  const selectedDayTitle = useMemo(
    () =>
      selectedDate.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [selectedDate, locale],
  );

  return (
    <View
      style={[
        styles.card,
        {
          borderColor,
          backgroundColor: surfaceColor,
        },
      ]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Icon name={AppIcon.Programacao} size="md" color={AppPalette.primary} />
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t("myCalendarTitle")}</Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile-my-calendar")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t("myCalendarSeeAllA11y")}
          style={styles.seeAllRow}>
          <Text style={[styles.seeAll, { color: AppPalette.primary }]}>{t("myCalendarSeeAll")}</Text>
          <View style={styles.chevron}>
            <Icon name={AppIcon.ChevronLeft} size="sm" color={AppPalette.primary} />
          </View>
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: subtitleColor }]}>{t("myCalendarProfileCardHint")}</Text>

      <ProfileMyCalendarWeekStrip
        events={LOCAL_MY_CALENDAR_EVENTS}
        locale={locale}
        textColor={textColor}
        mutedColor={mutedColor}
        surfaceColor={surfaceColor}
        borderColor={borderColor}
        selectedDayKey={selectedDayKey}
        todayLabel={t("myCalendarTodayShort")}
        onSelectDay={setSelectedDayKey}
        embedded
        dayA11yWithEvents={({ weekdayLong, dayNum, count }) =>
          t("myCalendarWeekStripDayA11yEvents", {
            weekday: weekdayLong,
            day: dayNum,
            count,
          })
        }
        dayA11yNoEvents={({ weekdayLong, dayNum }) =>
          t("myCalendarWeekStripDayA11yEmpty", { weekday: weekdayLong, day: dayNum })
        }
      />

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      <Text
        style={[styles.dayCaption, { color: textColor }]}
        accessibilityRole="header">
        {t("myCalendarProfileDayCaption", { date: selectedDayTitle })}
      </Text>

      {dayEvents.length === 0 ? (
        <Text style={[styles.emptyDay, { color: subtitleColor }]}>
          {t("myCalendarProfileDayEmpty")}
        </Text>
      ) : (
        <View style={styles.eventList}>
          {dayEvents.map((row) => (
            <MyCalendarEventRow
              key={row.id}
              row={row}
              sourceLabel={sourceLabelFor(row, t)}
              textColor={textColor}
              subtitleColor={subtitleColor}
              mutedColor={mutedColor}
              borderColor={c.border}
              surfaceColor={c.background}
              chipBorderColor={chipBorderColor}
              onlineLabel={tDiscover("online")}
              compact
              onPress={() => router.push(`/event/${encodeURIComponent(row.eventId)}`)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Paddings.xl,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: Paddings.lg,
    gap: Paddings.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Paddings.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.sm,
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexShrink: 0,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: "600",
  },
  chevron: {
    transform: [{ rotate: "180deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth * 2,
    marginTop: Paddings.xs,
    marginBottom: Paddings.xs,
    opacity: 0.85,
  },
  dayCaption: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  emptyDay: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Paddings.xs,
  },
  eventList: {
    gap: Paddings.sm,
    marginTop: Paddings.xs,
  },
});
