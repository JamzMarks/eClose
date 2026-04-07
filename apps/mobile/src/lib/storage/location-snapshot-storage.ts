import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppStorageKey } from "@/lib/storage/storage-keys";

export type StoredLocationPermission = "undetermined" | "granted" | "denied";

export type LocationSnapshotV1 = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  /** ISO 8601 */
  updatedAt: string;
  permission: StoredLocationPermission;
};

export async function loadLocationSnapshot(): Promise<LocationSnapshotV1 | null> {
  const raw = await AsyncStorage.getItem(AppStorageKey.locationSnapshot);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as LocationSnapshotV1;
    if (
      typeof p.latitude !== "number" ||
      typeof p.longitude !== "number" ||
      typeof p.updatedAt !== "string" ||
      !isPermission(p.permission)
    ) {
      return null;
    }
    return {
      ...p,
      accuracy: typeof p.accuracy === "number" ? p.accuracy : null,
    };
  } catch {
    return null;
  }
}

export async function saveLocationSnapshot(snapshot: LocationSnapshotV1): Promise<void> {
  await AsyncStorage.setItem(AppStorageKey.locationSnapshot, JSON.stringify(snapshot));
}

function isPermission(v: unknown): v is StoredLocationPermission {
  return v === "undetermined" || v === "granted" || v === "denied";
}
