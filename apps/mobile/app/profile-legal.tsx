import { useLocalSearchParams } from "expo-router";

import { ProfileLegalModalScreen } from "@/components/profile/profile-legal-modal.screen";

export default function ProfileLegalRoute() {
  const { kind } = useLocalSearchParams<{ kind?: string | string[] }>();
  const value = Array.isArray(kind) ? kind[0] : kind;

  return <ProfileLegalModalScreen kind={value} />;
}
