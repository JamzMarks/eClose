/**
 * Slides do intro da app (4). Chaves i18n no namespace `onboarding` (ficheiro pt/onboarding.json).
 */
export type AppIntroSlideDef = {
  id: string;
  titleKey: string;
  bodyKey: string;
};

export const APP_INTRO_SLIDES: readonly AppIntroSlideDef[] = [
  { id: "welcome", titleKey: "appIntroSlide1Title", bodyKey: "appIntroSlide1Body" },
  { id: "discover", titleKey: "appIntroSlide2Title", bodyKey: "appIntroSlide2Body" },
  { id: "trust", titleKey: "appIntroSlide3Title", bodyKey: "appIntroSlide3Body" },
  { id: "start", titleKey: "appIntroSlide4Title", bodyKey: "appIntroSlide4Body" },
];
