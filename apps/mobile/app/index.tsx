import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function Index() {
  const { isReady, isSignedIn } = useAuth();
  const { hydrated, introPending } = useOnboarding();

  if (!isReady || !hydrated) {
    return null;
  }

  if (isSignedIn && introPending) {
    return <Redirect href="/onboarding" />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
