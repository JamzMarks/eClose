/**
 * Quando `true`, os services devolvem JSON hardcoded (sem HTTP).
 * Definir `EXPO_PUBLIC_USE_API_MOCKS=true` só para demos/offline.
 */
export const USE_API_MOCKS = process.env.EXPO_PUBLIC_USE_API_MOCKS === "true";

