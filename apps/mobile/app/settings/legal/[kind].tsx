import { useLocalSearchParams } from "expo-router";

import { ProfileLegalStackScreen } from "@/components/profile/profile-legal-modal.screen";

export default function SettingsLegalRoute() {
  const { kind } = useLocalSearchParams<{ kind?: string | string[] }>();
  const value = Array.isArray(kind) ? kind[0] : kind;

  return <ProfileLegalStackScreen kind={value} />;
}
