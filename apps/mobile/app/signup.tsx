import { Redirect } from "expo-router";

/**
 * Mantém o URL `/signup` (deep links, favoritos) sem empilhar um segundo modal sobre o login.
 */
export default function SignupRedirectScreen() {
  return <Redirect href="/login?mode=signup" />;
}
