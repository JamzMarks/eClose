/**
 * Slides do intro da app (4). Chaves i18n em `onboarding` namespace.
 */
export type OnboardingSlideDef = {
  id: string;
  titleKey: string;
  bodyKey: string;
};

export const ONBOARDING_SLIDES: readonly OnboardingSlideDef[] = [
  { id: "welcome", titleKey: "appIntroSlide1Title", bodyKey: "appIntroSlide1Body" },
  { id: "discover", titleKey: "appIntroSlide2Title", bodyKey: "appIntroSlide2Body" },
  { id: "trust", titleKey: "appIntroSlide3Title", bodyKey: "appIntroSlide3Body" },
  { id: "start", titleKey: "appIntroSlide4Title", bodyKey: "appIntroSlide4Body" },
];
