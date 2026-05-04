import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import {
  defaultProfileUiDraft,
  profileUiDraftStorageKey,
  type ProfileUiDraft,
} from "@/types/profile-ui-draft.types";

export function useProfileUiDraft() {
  const [draft, setDraft] = useState<ProfileUiDraft>(() => defaultProfileUiDraft());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(profileUiDraftStorageKey);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<ProfileUiDraft>;
          setDraft({ ...defaultProfileUiDraft(), ...parsed });
        }
      } catch {
        //
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setDraftAndPersist = useCallback((next: ProfileUiDraft) => {
    setDraft(next);
    void AsyncStorage.setItem(profileUiDraftStorageKey, JSON.stringify(next)).catch(() => {});
  }, []);

  const updateDraft = useCallback((patch: Partial<ProfileUiDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      void AsyncStorage.setItem(profileUiDraftStorageKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { draft, setDraft: setDraftAndPersist, updateDraft, hydrated };
}
