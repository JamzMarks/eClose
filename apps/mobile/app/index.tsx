import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";
import { useAppIntro } from "@/features/app-intro";

export default function Index() {
  const { isReady, isSignedIn } = useAuth();
  const { hydrated, introPending } = useAppIntro();

  if (!isReady || !hydrated) {
    return null;
  }

  if (isSignedIn && introPending) {
    return <Redirect href="/app-intro" />;
  }

  return <Redirect href="/(tabs)" />;
}
