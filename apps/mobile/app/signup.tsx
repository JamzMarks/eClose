import { Redirect } from "expo-router";

export default function SignupRedirectScreen() {
  return <Redirect href="/login?mode=signup" />;
}
