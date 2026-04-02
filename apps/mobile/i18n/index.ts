/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptAuth from './locales/pt/auth.json';
import ptCommon from './locales/pt/common.json';
import ptDiscover from './locales/pt/discover.json';
import ptOnboarding from './locales/pt/onboarding.json';
import ptProfile from './locales/pt/profile.json';
import ptSettings from './locales/pt/settings.json';
import ptTabs from './locales/pt/tabs.json';

i18n.use(initReactI18next)
  .init({
    lng: 'pt',
    fallbackLng: 'pt',

    resources: {
      pt: {
        auth: ptAuth,
        common: ptCommon,
        discover: ptDiscover,
        onboarding: ptOnboarding,
        profile: ptProfile,
        settings: ptSettings,
        tabs: ptTabs,
      },
    },

    ns: ['common', 'tabs', 'auth', 'onboarding', 'discover', 'profile', 'settings'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;