import { Redirect } from "expo-router";

export default function SettingsAccountEmailRedirectRoute() {
  return <Redirect href="/settings/account?expand=email" />;
}
