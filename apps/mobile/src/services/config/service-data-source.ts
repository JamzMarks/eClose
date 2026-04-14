/**
 * Quando `true`, os services devolvem dados estáticos (`*.local-data.ts`). Por omissão usa a API HTTP.
 * Expo: `EXPO_PUBLIC_USE_LOCAL_SERVICE_DATA=true` para demos offline.
 */
export const USE_LOCAL_SERVICE_DATA =
  process.env.EXPO_PUBLIC_USE_LOCAL_SERVICE_DATA === "true";
