/** Prefixo único para não colidir com tokens/sessão (`@eclose/…`). */
export const APP_STORAGE_PREFIX = "@eclose/app";

export const AppStorageKey = {
  locationSnapshot: `${APP_STORAGE_PREFIX}/location_snapshot_v1`,
} as const;
