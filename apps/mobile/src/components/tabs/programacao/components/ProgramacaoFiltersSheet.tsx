import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { DiscoverEventListFilters } from "@/types/entities/discover.types";
import { defaultDiscoverEventFilters } from "@/types/entities/discover.types";
import type { DiscoveryLocationModeFilter } from "@/contracts/event.types";
import {
  formatLocalDateInputFromISO,
  parseLocalDateInputEnd,
  parseLocalDateInputStart,
} from "../programacao-date-presets";

export type ProgramacaoFiltersSheetLabels = {
  title: string;
  apply: string;
  reset: string;
  city: string;
  locationModeAll: string;
  locationModePhysical: string;
  locationModeOnline: string;
  locationModeSection: string;
  dateRangeSection: string;
  dateFromLabel: string;
  dateToLabel: string;
  datePlaceholder: string;
};

export type ProgramacaoFiltersSheetProps = {
  visible: boolean;
  onClose: () => void;
  eventFilters: DiscoverEventListFilters;
  onApply: (f: DiscoverEventListFilters) => void;
  labels: ProgramacaoFiltersSheetLabels;
};

export function ProgramacaoFiltersSheet({
  visible,
  onClose,
  eventFilters,
  onApply,
  labels,
}: ProgramacaoFiltersSheetProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const snapPoints = useMemo(() => ["58%", "90%"], []);

  const [draft, setDraft] = useState(eventFilters);
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");

  useEffect(() => {
    if (visible) {
      setDraft({ ...eventFilters });
      setFromDay(formatLocalDateInputFromISO(eventFilters.from));
      setToDay(formatLocalDateInputFromISO(eventFilters.to));
    }
  }, [visible, eventFilters]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  const apply = () => {
    const fromIso = fromDay.trim() ? parseLocalDateInputStart(fromDay.trim()) : null;
    const toIso = toDay.trim() ? parseLocalDateInputEnd(toDay.trim()) : null;
    onApply({
      ...draft,
      from: fromIso ?? "",
      to: toIso ?? "",
      query: eventFilters.query,
    });
    onClose();
  };

  const reset = () => {
    setDraft({ ...defaultDiscoverEventFilters(), query: eventFilters.query });
    setFromDay("");
    setToDay("");
  };

  const modeChip = (mode: DiscoveryLocationModeFilter, text: string) => {
    const selected = draft.locationMode === mode;
    return (
      <Pressable
        key={mode}
        onPress={() => setDraft((d) => ({ ...d, locationMode: mode }))}
        style={[
          styles.chip,
          {
            borderColor: selected ? AppPalette.primary : c.border,
            backgroundColor: selected ? `${AppPalette.primary}18` : "transparent",
          },
        ]}>
        <Text style={{ color: selected ? AppPalette.primary : c.text, fontWeight: "600", fontSize: 14 }}>
          {text}
        </Text>
      </Pressable>
    );
  };

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 28 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.sheetTitle, { color: c.text }]}>{labels.title}</Text>

        <FieldLabel color={c.textSecondary} text={labels.city} />
        <TextInput
          value={draft.city}
          onChangeText={(city) => setDraft((d) => ({ ...d, city }))}
          placeholder={labels.city}
          placeholderTextColor={c.textSecondary}
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />

        <FieldLabel color={c.textSecondary} text={labels.locationModeSection} />
        <View style={styles.chipRow}>
          {modeChip("ALL", labels.locationModeAll)}
          {modeChip("PHYSICAL", labels.locationModePhysical)}
          {modeChip("ONLINE", labels.locationModeOnline)}
        </View>

        <FieldLabel color={c.textSecondary} text={labels.dateRangeSection} />
        <FieldLabel color={c.textSecondary} text={labels.dateFromLabel} />
        <TextInput
          value={fromDay}
          onChangeText={setFromDay}
          placeholder={labels.datePlaceholder}
          placeholderTextColor={c.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />
        <FieldLabel color={c.textSecondary} text={labels.dateToLabel} />
        <TextInput
          value={toDay}
          onChangeText={setToDay}
          placeholder={labels.datePlaceholder}
          placeholderTextColor={c.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />

        <View style={styles.actions}>
          <Pressable onPress={reset} style={[styles.btnSecondary, { borderColor: c.border }]}>
            <Text style={{ color: c.text, fontWeight: "600" }}>{labels.reset}</Text>
          </Pressable>
          <Pressable onPress={apply} style={[styles.btnPrimary, { backgroundColor: AppPalette.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>{labels.apply}</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

function FieldLabel({ text, color }: { text: string; color: string }) {
  return <Text style={[styles.fieldLabel, { color }]}>{text}</Text>;
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.25)",
  },
  btnSecondary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnPrimary: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
});
