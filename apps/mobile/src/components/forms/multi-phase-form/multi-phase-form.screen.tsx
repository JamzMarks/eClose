import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MultiPhaseFormProvider,
  useMultiPhaseForm,
  useMultiPhaseFormIndex,
  type MultiPhaseFormNav,
} from "@/components/forms/multi-phase-form/multi-phase-form.context";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type MultiPhaseFormScreenProps = {
  /** Número de fases (>= 1). */
  phaseCount: number;
  /** Conteúdo da fase atual; pode usar serviços, formulários, etc. no pai. */
  renderPhase: (nav: MultiPhaseFormNav) => React.ReactNode;
  onClose: () => void;
  /** Título opcional no centro do header. */
  title?: string;
  /** Índice inicial (modo não controlado). */
  initialPhaseIndex?: number;
  /** Modo controlado: índice atual. */
  phaseIndex?: number;
  onPhaseIndexChange?: (index: number) => void;
  /** Texto do botão de fechar; se omitido, mostra ícone. */
  closeLabel?: string;
  closeAccessibilityLabel?: string;
  /** Mostra "fase atual / total" abaixo do título. */
  showStepIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
};

function MultiPhaseFormScreenInner({
  renderPhase,
  title,
  closeLabel,
  closeAccessibilityLabel = "Fechar",
  showStepIndicator = true,
  style,
}: Pick<
  MultiPhaseFormScreenProps,
  | "renderPhase"
  | "title"
  | "closeLabel"
  | "closeAccessibilityLabel"
  | "showStepIndicator"
  | "style"
>) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const nav = useMultiPhaseForm();

  return (
    <View
      style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top }, style]}
    >
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Pressable
          onPress={nav.close}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={closeAccessibilityLabel}
          style={styles.headerSide}>
          {closeLabel ? (
            <Text style={[styles.closeLabel, { color: AppPalette.primary }]} numberOfLines={1}>
              {closeLabel}
            </Text>
          ) : (
            <X size={22} color={c.text} strokeWidth={2.25} />
          )}
        </Pressable>
        <View style={styles.headerCenter}>
          {title ? (
            <Text style={[styles.headerTitle, { color: c.text }]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {showStepIndicator ? (
            <Text style={[styles.stepMeta, { color: c.textMuted }]}>
              {nav.phaseIndex + 1} / {nav.phaseCount}
            </Text>
          ) : null}
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]} />
      </View>
      <View style={[styles.body, { paddingBottom: insets.bottom + 16 }]}>{renderPhase(nav)}</View>
    </View>
  );
}

export function MultiPhaseFormScreen({
  phaseCount,
  renderPhase,
  onClose,
  title,
  initialPhaseIndex = 0,
  phaseIndex: controlledPhaseIndex,
  onPhaseIndexChange,
  closeLabel,
  closeAccessibilityLabel,
  showStepIndicator,
  style,
}: MultiPhaseFormScreenProps) {
  const [index, setIndex] = useMultiPhaseFormIndex({
    phaseCount,
    initialPhaseIndex,
    phaseIndex: controlledPhaseIndex,
    onPhaseIndexChange,
  });

  return (
    <MultiPhaseFormProvider
      phaseCount={phaseCount}
      phaseIndex={index}
      onPhaseIndexChange={setIndex}
      onClose={onClose}>
      <MultiPhaseFormScreenInner
        renderPhase={renderPhase}
        title={title}
        closeLabel={closeLabel}
        closeAccessibilityLabel={closeAccessibilityLabel}
        showStepIndicator={showStepIndicator}
        style={style}
      />
    </MultiPhaseFormProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerSide: {
    minWidth: 44,
    justifyContent: "center",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  closeLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  stepMeta: {
    fontSize: 13,
    fontWeight: "500",
  },
  body: {
    flex: 1,
  },
});
