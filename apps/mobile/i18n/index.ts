/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptCommon from './locales/pt/common.json';
import ptTabs from './locales/pt/tabs.json';

i18n.use(initReactI18next)
  .init({
    lng: 'pt',
    fallbackLng: 'pt',

    resources: {
      pt: {
        common: ptCommon,
        tabs: ptTabs,
      },
    },

    ns: ['common', 'tabs'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;