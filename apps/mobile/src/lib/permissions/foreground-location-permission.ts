import { NativeModules, Platform } from "react-native";
import * as Location from "expo-location";
import { PermissionStatus as ExpoPermissionStatus } from "expo-location";

import type { StoredLocationPermission } from "@/lib/storage/location-snapshot-storage";

type RnpModule = typeof import("react-native-permissions");

/** `react-native-permissions` só existe no binário nativo (dev client / release). No Expo Go falha em runtime. */
function getReactNativePermissions(): RnpModule | null {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }
  if (NativeModules.RNPermissions == null) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("react-native-permissions") as RnpModule;
  } catch {
    return null;
  }
}

function mapExpoStatus(status: ExpoPermissionStatus): StoredLocationPermission {
  if (status === ExpoPermissionStatus.GRANTED) return "granted";
  if (status === ExpoPermissionStatus.DENIED) return "denied";
  return "undetermined";
}

function mapCheckResult(
  status: import("react-native-permissions").PermissionStatus,
  RESULTS: RnpModule["RESULTS"],
): StoredLocationPermission {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return "granted";
  if (status === RESULTS.BLOCKED || status === RESULTS.UNAVAILABLE) return "denied";
  return "undetermined";
}

function mapRequestResult(
  status: import("react-native-permissions").PermissionStatus,
  RESULTS: RnpModule["RESULTS"],
): StoredLocationPermission {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return "granted";
  return "denied";
}

async function checkViaExpo(): Promise<StoredLocationPermission> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return mapExpoStatus(status);
}

async function requestViaExpo(): Promise<StoredLocationPermission> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return mapExpoStatus(status);
}

export async function checkForegroundLocationPermission(): Promise<StoredLocationPermission> {
  const rnp = getReactNativePermissions();
  if (!rnp) {
    return checkViaExpo();
  }
  const { check, PERMISSIONS, RESULTS } = rnp;
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const status = await check(permission);
  return mapCheckResult(status, RESULTS);
}

export async function requestForegroundLocationPermission(): Promise<StoredLocationPermission> {
  const rnp = getReactNativePermissions();
  if (!rnp) {
    return requestViaExpo();
  }
  const { request, PERMISSIONS, RESULTS } = rnp;
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const status = await request(permission);
  return mapRequestResult(status, RESULTS);
}
