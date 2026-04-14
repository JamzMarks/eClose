import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as Location from "expo-location";

import {
  checkForegroundLocationPermission,
  requestForegroundLocationPermission,
} from "@/lib/permissions/foreground-location-permission";
import {
  loadLocationSnapshot,
  saveLocationSnapshot,
  type LocationSnapshotV1,
  type StoredLocationPermission,
} from "@/lib/storage/location-snapshot-storage";

export type AppLocationCoords = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

type LocationContextValue = {
  /** Já leu disco e alinhou permissão com o sistema. */
  hydrated: boolean;
  permission: StoredLocationPermission;
  /** Última posição conhecida (GPS recente ou cache local). */
  coords: AppLocationCoords | null;
  lastUpdatedAt: string | null;
  error: string | null;
  isRefreshing: boolean;
  /** Permissão actual + GPS se `granted`. Não abre diálogo se já estiver decidido. */
  refresh: () => Promise<void>;
  /** Pede permissão ao utilizador (primeira vez ou após alterar em Definições). */
  requestPermissionAndRefresh: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

function snapshotToCoords(s: LocationSnapshotV1): AppLocationCoords {
  return {
    latitude: s.latitude,
    longitude: s.longitude,
    accuracy: s.accuracy,
  };
}

export type LocationProviderProps = {
  children: ReactNode;
  /**
   * Se true, no primeiro arranque com `undetermined`, pede localização (mostra diálogo do SO).
   * Por defeito false — usar um botão no ecrã com `requestPermissionAndRefresh()`.
   */
  requestOnFirstLaunch?: boolean;
};

export function LocationProvider({
  children,
  requestOnFirstLaunch = false,
}: LocationProviderProps) {
  const [hydrated, setHydrated] = useState(false);
  const [permission, setPermission] = useState<StoredLocationPermission>("undetermined");
  const [coords, setCoords] = useState<AppLocationCoords | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPositionIfGranted = useCallback(async (): Promise<void> => {
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const next: AppLocationCoords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy ?? null,
      };
      const updatedAt = new Date().toISOString();
      setCoords(next);
      setLastUpdatedAt(updatedAt);
      await saveLocationSnapshot({
        latitude: next.latitude,
        longitude: next.longitude,
        accuracy: next.accuracy,
        updatedAt,
        permission: "granted",
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "location_error");
    }
  }, []);

  const persistDeniedKeepingCoords = useCallback(async () => {
    const snap = await loadLocationSnapshot();
    const lat = coords?.latitude ?? snap?.latitude;
    const lng = coords?.longitude ?? snap?.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return;
    const updatedAt = new Date().toISOString();
    await saveLocationSnapshot({
      latitude: lat,
      longitude: lng,
      accuracy: coords?.accuracy ?? snap?.accuracy ?? null,
      updatedAt,
      permission: "denied",
    });
    setLastUpdatedAt(updatedAt);
  }, [coords]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const snap = await loadLocationSnapshot();
      let p = await checkForegroundLocationPermission();
      if (snap?.permission === "denied" && p !== "granted") {
        p = "denied";
      }
      setPermission(p);
      if (p === "granted") {
        await fetchPositionIfGranted();
      } else if (p === "denied") {
        await persistDeniedKeepingCoords();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "location_error");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPositionIfGranted, persistDeniedKeepingCoords]);

  const requestPermissionAndRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const p = await requestForegroundLocationPermission();
      setPermission(p);
      if (p === "granted") {
        await fetchPositionIfGranted();
      } else if (p === "denied") {
        await persistDeniedKeepingCoords();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "location_error");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPositionIfGranted, persistDeniedKeepingCoords]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const snap = await loadLocationSnapshot();
      if (cancelled) return;
      if (snap) {
        setPermission(snap.permission);
        setCoords(snapshotToCoords(snap));
        setLastUpdatedAt(snap.updatedAt);
      }

      try {
        let p = await checkForegroundLocationPermission();
        if (cancelled) return;

        if (p === "undetermined" && requestOnFirstLaunch) {
          p = await requestForegroundLocationPermission();
        }

        if (snap?.permission === "denied" && p !== "granted") {
          p = "denied";
        }

        setPermission(p);

        if (p === "granted") {
          await fetchPositionIfGranted();
        } else if (p === "denied" && snap) {
          await saveLocationSnapshot({ ...snap, permission: "denied" });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "location_init_error");
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchPositionIfGranted, requestOnFirstLaunch]);

  const value = useMemo<LocationContextValue>(
    () => ({
      hydrated,
      permission,
      coords,
      lastUpdatedAt,
      error,
      isRefreshing,
      refresh,
      requestPermissionAndRefresh,
    }),
    [
      hydrated,
      permission,
      coords,
      lastUpdatedAt,
      error,
      isRefreshing,
      refresh,
      requestPermissionAndRefresh,
    ],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useAppLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useAppLocation must be used within LocationProvider");
  }
  return ctx;
}
