import { useCallback, useMemo, useRef, type ComponentRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type SettingsPickerOption = {
  key: string;
  icon: AppIcon;
  label: string;
};

export type SettingsPreferencePickerSheetProps = {
  visible: boolean;
  title: string;
  /** Ícone à esquerda do título (alinhado com as linhas nas definições). */
  titleIcon?: AppIcon;
  options: SettingsPickerOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
  cancelLabel: string;
};

export function SettingsPreferencePickerSheet({
  visible,
  title,
  titleIcon,
  options,
  selectedKey,
  onSelect,
  onClose,
  cancelLabel,
}: SettingsPreferencePickerSheetProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["46%"], []);
  const sheetRef = useRef<ComponentRef<typeof BottomSheet>>(null);

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

  function pick(key: string) {
    onSelect(key);
    sheetRef.current?.close();
  }

  function handleCancel() {
    sheetRef.current?.close();
  }

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      containerStyle={styles.hostContainer}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetView
        style={[styles.body, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <View style={styles.titleRow}>
          {titleIcon ? (
            <View style={styles.titleIconWrap}>
              <Icon name={titleIcon} size="md" color={c.text} />
            </View>
          ) : null}
          <Text style={[styles.sheetTitle, { color: c.text }]}>{title}</Text>
        </View>

        <View style={[styles.actions, { borderColor: c.border }]}>
          {options.map((opt, index) => {
            const selected = opt.key === selectedKey;
            const isLast = index === options.length - 1;
            return (
              <Pressable
                key={opt.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={opt.label}
                onPress={() => pick(opt.key)}
                style={({ pressed }) => [
                  styles.row,
                  !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
                  pressed && { opacity: 0.65 },
                ]}>
                <Icon name={opt.icon} size="md" color={selected ? AppPalette.primary : c.text} />
                <Text style={[styles.rowLabel, { color: c.text }]} numberOfLines={2}>
                  {opt.label}
                </Text>
                {selected ? (
                  <Text style={[styles.check, { color: AppPalette.primary }]} accessible={false}>
                    ✓
                  </Text>
                ) : (
                  <View style={styles.checkSpacer} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={handleCancel}
          style={({ pressed }) => [
            styles.cancelBtn,
            { borderColor: c.border },
            pressed && { opacity: 0.75 },
          ]}>
          <Text style={[styles.cancelText, { color: c.text }]}>{cancelLabel}</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    zIndex: 5000,
    elevation: 5000,
  },
  body: {
    paddingHorizontal: Paddings.xl,
    paddingTop: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.sm,
    marginBottom: Paddings.md,
  },
  titleIconWrap: {
    marginTop: 1,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  actions: {
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.md,
    paddingVertical: Paddings.md,
    paddingHorizontal: Paddings.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  check: {
    fontSize: 18,
    fontWeight: "800",
    minWidth: 22,
    textAlign: "center",
  },
  checkSpacer: {
    minWidth: 22,
  },
  cancelBtn: {
    marginTop: Paddings.md,
    alignItems: "center",
    paddingVertical: Paddings.md,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
