import enTranslation from './en';
import ruTranslation from './ru';

import 'moment/locale/ru';

export const i18nextOptions = {
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      translation: enTranslation
    },
    ru: {
      translation: ruTranslation
    }
  }
};
