import { useCallback, useEffect, useState } from "react";

import { appLocalStorage } from "@/lib/storage/app-local-storage";

/**
 * Estado JSON persistido com `appLocalStorage` (chave curta, ex. `prefs.discoverRadius`).
 * `ready` fica true após a primeira leitura do disco.
 */
export function usePersistedAppJson<T extends Record<string, unknown>>(
  shortKey: string,
  initial: T,
): readonly [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void appLocalStorage.getJson<T>(shortKey).then((v) => {
      if (cancelled) return;
      if (v !== null) setState(v);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [shortKey]);

  const setPersisted = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        void appLocalStorage.setJson(shortKey, next);
        return next;
      });
    },
    [shortKey],
  );

  return [state, setPersisted, ready] as const;
}
