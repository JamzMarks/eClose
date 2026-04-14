import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import {
  DiscoverSegmentedKind,
  type DiscoverListKind,
} from "./discover-segmented-kind";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { DiscoverEventListFilters, DiscoverVenueListFilters } from "@/services/discover/discover-list-filters.types";
import type { DiscoveryLocationModeFilter } from "@/services/types/event.types";

export type DiscoverFiltersSheetLabels = {
  title: string;
  apply: string;
  reset: string;
  city: string;
  region: string;
  query: string;
  locationModeAll: string;
  locationModePhysical: string;
  locationModeOnline: string;
  openToInquiries: string;
  locationModeSection: string;
  listKindSection: string;
  segmentEvents: string;
  segmentVenues: string;
  segmentArtists: string;
  artistsFiltersHint: string;
};

export type DiscoverFiltersSheetProps = {
  visible: boolean;
  onClose: () => void;
  listKind: DiscoverListKind;
  onListKindChange: (kind: DiscoverListKind) => void;
  eventFilters: DiscoverEventListFilters;
  venueFilters: DiscoverVenueListFilters;
  onApplyEvents: (f: DiscoverEventListFilters) => void;
  onApplyVenues: (f: DiscoverVenueListFilters) => void;
  labels: DiscoverFiltersSheetLabels;
};

export function DiscoverFiltersSheet({
  visible,
  onClose,
  listKind,
  onListKindChange,
  eventFilters,
  venueFilters,
  onApplyEvents,
  onApplyVenues,
  labels,
}: DiscoverFiltersSheetProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const snapPoints = useMemo(() => ["58%", "90%"], []);

  const [draftEvents, setDraftEvents] = useState(eventFilters);
  const [draftVenues, setDraftVenues] = useState(venueFilters);

  useEffect(() => {
    if (visible) {
      setDraftEvents({ ...eventFilters });
      setDraftVenues({ ...venueFilters });
    }
  }, [visible, eventFilters, venueFilters]);

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
    if (listKind === "events") {
      onApplyEvents(draftEvents);
    } else if (listKind === "venues") {
      onApplyVenues(draftVenues);
    }
    onClose();
  };

  const reset = () => {
    if (listKind === "events") {
      setDraftEvents({
        city: "",
        locationMode: "ALL",
        query: "",
      });
    } else if (listKind === "venues") {
      setDraftVenues({
        city: "",
        region: "",
        openToInquiriesOnly: false,
      });
    }
  };

  const modeChip = (mode: DiscoveryLocationModeFilter, text: string) => {
    const selected = draftEvents.locationMode === mode;
    return (
      <Pressable
        key={mode}
        onPress={() => setDraftEvents((d) => ({ ...d, locationMode: mode }))}
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
      backgroundStyle={{ backgroundColor: c.background }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 28 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.sheetTitle, { color: c.text }]}>{labels.title}</Text>

        <FieldLabel color={c.textSecondary} text={labels.listKindSection} />
        <DiscoverSegmentedKind
          embedded
          value={listKind}
          onChange={onListKindChange}
                   labels={{
            events: labels.segmentEvents,
            venues: labels.segmentVenues,
            artists: labels.segmentArtists,
          }}
          activeBackground={AppPalette.primary}
          activeText={AppPalette.white}
          inactiveText={c.textSecondary}
          trackBackground={scheme === "dark" ? c.surfaceElevated : c.border}
        />

        {listKind === "events" ? (
          <>
            <FieldLabel color={c.textSecondary} text={labels.city} />
            <TextInput
              value={draftEvents.city}
              onChangeText={(city) => setDraftEvents((d) => ({ ...d, city }))}
              placeholder={labels.city}
              placeholderTextColor={c.textSecondary}
              style={[styles.input, { color: c.text, borderColor: c.border }]}
            />
            <FieldLabel color={c.textSecondary} text={labels.query} />
            <TextInput
              value={draftEvents.query}
              onChangeText={(query) => setDraftEvents((d) => ({ ...d, query }))}
              placeholder={labels.query}
              placeholderTextColor={c.textSecondary}
              style={[styles.input, { color: c.text, borderColor: c.border }]}
            />
            <FieldLabel color={c.textSecondary} text={labels.locationModeSection} />
            <View style={styles.chipRow}>
              {modeChip("ALL", labels.locationModeAll)}
              {modeChip("PHYSICAL", labels.locationModePhysical)}
              {modeChip("ONLINE", labels.locationModeOnline)}
            </View>
          </>
        ) : listKind === "venues" ? (
          <>
            <FieldLabel color={c.textSecondary} text={labels.city} />
            <TextInput
              value={draftVenues.city}
              onChangeText={(city) => setDraftVenues((d) => ({ ...d, city }))}
              placeholder={labels.city}
              placeholderTextColor={c.textSecondary}
              style={[styles.input, { color: c.text, borderColor: c.border }]}
            />
            <FieldLabel color={c.textSecondary} text={labels.region} />
            <TextInput
              value={draftVenues.region}
              onChangeText={(region) => setDraftVenues((d) => ({ ...d, region }))}
              placeholder={labels.region}
              placeholderTextColor={c.textSecondary}
              style={[styles.input, { color: c.text, borderColor: c.border }]}
            />
            <View style={styles.switchRow}>
              <Text style={{ color: c.text, flex: 1 }}>{labels.openToInquiries}</Text>
              <Switch
                value={draftVenues.openToInquiriesOnly}
                onValueChange={(openToInquiriesOnly) =>
                  setDraftVenues((d) => ({ ...d, openToInquiriesOnly }))
                }
                trackColor={{ false: c.border, true: `${AppPalette.primary}88` }}
                thumbColor={draftVenues.openToInquiriesOnly ? AppPalette.primary : "#f4f4f5"}
              />
            </View>
          </>
        ) : (
          <Text style={{ color: c.textSecondary, marginTop: 8, lineHeight: 20 }}>
            {labels.artistsFiltersHint}
          </Text>
        )}

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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
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
