/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enDiscover from './locales/en/discover.json';
import enSettings from './locales/en/settings.json';
import enTabs from './locales/en/tabs.json';
import enProfile from './locales/en/profile.json';
import enWishlists from './locales/en/wishlists.json';
import ptAuth from './locales/pt/auth.json';
import ptCommon from './locales/pt/common.json';
import ptDiscover from './locales/pt/discover.json';
import ptOnboarding from './locales/pt/onboarding.json';
import ptProfile from './locales/pt/profile.json';
import ptSettings from './locales/pt/settings.json';
import ptTabs from './locales/pt/tabs.json';
import ptWishlists from './locales/pt/wishlists.json';

i18n.use(initReactI18next)
  .init({
    lng: 'pt',
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],

    resources: {
      pt: {
        auth: ptAuth,
        common: ptCommon,
        discover: ptDiscover,
        onboarding: ptOnboarding,
        profile: ptProfile,
        settings: ptSettings,
        tabs: ptTabs,
        wishlists: ptWishlists,
      },
      en: {
        auth: enAuth,
        common: enCommon,
        discover: enDiscover,
        profile: enProfile,
        settings: enSettings,
        tabs: enTabs,
        wishlists: enWishlists,
      },
    },

    ns: ['common', 'tabs', 'auth', 'onboarding', 'discover', 'profile', 'settings', 'wishlists'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;