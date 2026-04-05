import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MultiPhaseFormNav = {
  phaseIndex: number;
  phaseCount: number;
  isFirst: boolean;
  isLast: boolean;
  setPhaseIndex: (index: number) => void;
  goNext: () => void;
  goBack: () => void;
  close: () => void;
};

const MultiPhaseFormContext = createContext<MultiPhaseFormNav | null>(null);

export type MultiPhaseFormProviderProps = {
  phaseCount: number;
  phaseIndex: number;
  onPhaseIndexChange: (index: number) => void;
  onClose: () => void;
  children: ReactNode;
};

export function MultiPhaseFormProvider({
  phaseCount,
  phaseIndex,
  onPhaseIndexChange,
  onClose,
  children,
}: MultiPhaseFormProviderProps) {
  const safeCount = Math.max(1, phaseCount);
  const clampedIndex = Math.min(Math.max(0, phaseIndex), safeCount - 1);

  const setPhaseIndex = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(0, index), safeCount - 1);
      onPhaseIndexChange(next);
    },
    [onPhaseIndexChange, safeCount],
  );

  const goNext = useCallback(() => {
    setPhaseIndex(clampedIndex + 1);
  }, [clampedIndex, setPhaseIndex]);

  const goBack = useCallback(() => {
    setPhaseIndex(clampedIndex - 1);
  }, [clampedIndex, setPhaseIndex]);

  const value = useMemo<MultiPhaseFormNav>(
    () => ({
      phaseIndex: clampedIndex,
      phaseCount: safeCount,
      isFirst: clampedIndex <= 0,
      isLast: clampedIndex >= safeCount - 1,
      setPhaseIndex,
      goNext,
      goBack,
      close: onClose,
    }),
    [clampedIndex, goBack, goNext, onClose, safeCount, setPhaseIndex],
  );

  return (
    <MultiPhaseFormContext.Provider value={value}>{children}</MultiPhaseFormContext.Provider>
  );
}

export function useMultiPhaseForm(): MultiPhaseFormNav {
  const ctx = useContext(MultiPhaseFormContext);
  if (!ctx) {
    throw new Error("useMultiPhaseForm must be used within MultiPhaseFormProvider");
  }
  return ctx;
}

export function useOptionalMultiPhaseForm(): MultiPhaseFormNav | null {
  return useContext(MultiPhaseFormContext);
}

export type UseMultiPhaseFormIndexOptions = {
  phaseCount: number;
  initialPhaseIndex?: number;
  phaseIndex?: number;
  onPhaseIndexChange?: (index: number) => void;
};

export function useMultiPhaseFormIndex({
  phaseCount,
  initialPhaseIndex = 0,
  phaseIndex: controlledIndex,
  onPhaseIndexChange,
}: UseMultiPhaseFormIndexOptions): [number, (index: number) => void] {
  const [internal, setInternal] = useState(initialPhaseIndex);
  const isControlled = controlledIndex !== undefined;

  const index = isControlled ? controlledIndex! : internal;

  const setIndex = useCallback(
    (next: number) => {
      if (isControlled) {
        onPhaseIndexChange?.(next);
      } else {
        setInternal(next);
        onPhaseIndexChange?.(next);
      }
    },
    [isControlled, onPhaseIndexChange],
  );

  return [index, setIndex];
}
