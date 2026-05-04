/**
 * Estado local de perfil (UI-only / mock) até existir API dedicada.
 * Persistido em AsyncStorage via `useProfileUiDraft`.
 */
export type ProfileUiDraft = {
  city: string;
  bio: string;
  /** Tags separadas por vírgula na UI; normalizadas em memória. */
  interestsCsv: string;
  useCustomAvatar: boolean;
  customAvatarUri: string | null;
  /** Idioma preferido BCP-47 (ex.: pt-PT, en-GB). */
  preferredLanguage: string;
};

export const profileUiDraftStorageKey = "profile_ui_draft_v1";

export const defaultProfileUiDraft = (): ProfileUiDraft => ({
  city: "",
  bio: "",
  interestsCsv: "",
  useCustomAvatar: false,
  customAvatarUri: null,
  preferredLanguage: "",
});
