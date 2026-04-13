import { Redirect } from "expo-router";

export default function SettingsAccountPasswordRedirectRoute() {
  return <Redirect href="/settings/account?expand=password" />;
}
