import { Redirect } from "expo-router";

export default function SettingsAccountNameRedirectRoute() {
  return <Redirect href="/settings/account?expand=name" />;
}
