import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { DiscoverListKind } from "@/components/discover/discover-segmented-kind";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type {
  DiscoverEventListFilters,
  DiscoverVenueListFilters,
  EventLocationModeFilter,
} from "@/infrastructure/discover/discover-list-filters.types";

export type DiscoverFiltersModalProps = {
  visible: boolean;
  onClose: () => void;
  listKind: DiscoverListKind;
  eventFilters: DiscoverEventListFilters;
  venueFilters: DiscoverVenueListFilters;
  onApplyEvents: (f: DiscoverEventListFilters) => void;
  onApplyVenues: (f: DiscoverVenueListFilters) => void;
  labels: {
    title: string;
    apply: string;
    reset: string;
    city: string;
    region: string;
    query: string;
    locationModeAll: string;
    locationModePhysical: string;
    locationModeOnline: string;
    sortSection: string;
    sortStartsAt: string;
    sortTitle: string;
    sortName: string;
    sortCity: string;
    orderSection: string;
    orderAsc: string;
    orderDesc: string;
    openToInquiries: string;
    locationModeSection: string;
  };
};

export function DiscoverFiltersModal({
  visible,
  onClose,
  listKind,
  eventFilters,
  venueFilters,
  onApplyEvents,
  onApplyVenues,
  labels,
}: DiscoverFiltersModalProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();

  const [draftEvents, setDraftEvents] = useState(eventFilters);
  const [draftVenues, setDraftVenues] = useState(venueFilters);

  useEffect(() => {
    if (visible) {
      setDraftEvents({ ...eventFilters });
      setDraftVenues({ ...venueFilters });
    }
  }, [visible, eventFilters, venueFilters]);

  const apply = () => {
    if (listKind === "events") {
      onApplyEvents(draftEvents);
    } else {
      onApplyVenues(draftVenues);
    }
    onClose();
  };

  const reset = () => {
    if (listKind === "events") {
      setDraftEvents({
        city: "",
        locationMode: "ALL",
        sortBy: "startsAt",
        order: "ASC",
        query: "",
      });
    } else {
      setDraftVenues({
        city: "",
        region: "",
        sortBy: "name",
        order: "ASC",
        openToInquiriesOnly: false,
      });
    }
  };

  const modeChip = (mode: EventLocationModeFilter, text: string) => {
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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.background,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          <View style={[styles.sheetHandle, { backgroundColor: c.border }]} />
          <Text style={[styles.sheetTitle, { color: c.text }]}>{labels.title}</Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
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
                <FieldLabel color={c.textSecondary} text={labels.sortSection} />
                <View style={styles.rowGap}>
                  <Pressable
                    onPress={() => setDraftEvents((d) => ({ ...d, sortBy: "startsAt" }))}
                    style={styles.choiceRow}>
                    <Text style={{ color: c.text }}>{labels.sortStartsAt}</Text>
                    <Text style={{ color: draftEvents.sortBy === "startsAt" ? AppPalette.primary : c.textSecondary }}>
                      {draftEvents.sortBy === "startsAt" ? "✓" : ""}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDraftEvents((d) => ({ ...d, sortBy: "title" }))}
                    style={styles.choiceRow}>
                    <Text style={{ color: c.text }}>{labels.sortTitle}</Text>
                    <Text style={{ color: draftEvents.sortBy === "title" ? AppPalette.primary : c.textSecondary }}>
                      {draftEvents.sortBy === "title" ? "✓" : ""}
                    </Text>
                  </Pressable>
                </View>
                <FieldLabel color={c.textSecondary} text={labels.orderSection} />
                <View style={styles.chipRow}>
                  <Pressable
                    onPress={() => setDraftEvents((d) => ({ ...d, order: "ASC" }))}
                    style={[
                      styles.chip,
                      {
                        borderColor: draftEvents.order === "ASC" ? AppPalette.primary : c.border,
                        backgroundColor: draftEvents.order === "ASC" ? `${AppPalette.primary}18` : "transparent",
                      },
                    ]}>
                    <Text style={{ color: c.text, fontWeight: "600" }}>{labels.orderAsc}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDraftEvents((d) => ({ ...d, order: "DESC" }))}
                    style={[
                      styles.chip,
                      {
                        borderColor: draftEvents.order === "DESC" ? AppPalette.primary : c.border,
                        backgroundColor: draftEvents.order === "DESC" ? `${AppPalette.primary}18` : "transparent",
                      },
                    ]}>
                    <Text style={{ color: c.text, fontWeight: "600" }}>{labels.orderDesc}</Text>
                  </Pressable>
                </View>
              </>
            ) : (
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
                <FieldLabel color={c.textSecondary} text={labels.sortSection} />
                <View style={styles.rowGap}>
                  <Pressable
                    onPress={() => setDraftVenues((d) => ({ ...d, sortBy: "name" }))}
                    style={styles.choiceRow}>
                    <Text style={{ color: c.text }}>{labels.sortName}</Text>
                    <Text style={{ color: draftVenues.sortBy === "name" ? AppPalette.primary : c.textSecondary }}>
                      {draftVenues.sortBy === "name" ? "✓" : ""}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDraftVenues((d) => ({ ...d, sortBy: "city" }))}
                    style={styles.choiceRow}>
                    <Text style={{ color: c.text }}>{labels.sortCity}</Text>
                    <Text style={{ color: draftVenues.sortBy === "city" ? AppPalette.primary : c.textSecondary }}>
                      {draftVenues.sortBy === "city" ? "✓" : ""}
                    </Text>
                  </Pressable>
                </View>
                <FieldLabel color={c.textSecondary} text={labels.orderSection} />
                <View style={styles.chipRow}>
                  <Pressable
                    onPress={() => setDraftVenues((d) => ({ ...d, order: "ASC" }))}
                    style={[
                      styles.chip,
                      {
                        borderColor: draftVenues.order === "ASC" ? AppPalette.primary : c.border,
                        backgroundColor: draftVenues.order === "ASC" ? `${AppPalette.primary}18` : "transparent",
                      },
                    ]}>
                    <Text style={{ color: c.text, fontWeight: "600" }}>{labels.orderAsc}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDraftVenues((d) => ({ ...d, order: "DESC" }))}
                    style={[
                      styles.chip,
                      {
                        borderColor: draftVenues.order === "DESC" ? AppPalette.primary : c.border,
                        backgroundColor: draftVenues.order === "DESC" ? `${AppPalette.primary}18` : "transparent",
                      },
                    ]}>
                    <Text style={{ color: c.text, fontWeight: "600" }}>{labels.orderDesc}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable onPress={reset} style={[styles.btnSecondary, { borderColor: c.border }]}>
              <Text style={{ color: c.text, fontWeight: "600" }}>{labels.reset}</Text>
            </Pressable>
            <Pressable onPress={apply} style={[styles.btnPrimary, { backgroundColor: AppPalette.primary }]}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{labels.apply}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FieldLabel({ text, color }: { text: string; color: string }) {
  return <Text style={[styles.fieldLabel, { color }]}>{text}</Text>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "88%",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  scroll: { maxHeight: 420 },
  scrollContent: { paddingBottom: 16 },
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
  rowGap: { gap: 4 },
  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    marginTop: 8,
    paddingTop: 12,
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
