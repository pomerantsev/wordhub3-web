import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import {LanguageDetector} from 'i18next-express-middleware';
import enTranslation from './en';
import ruTranslation from './ru';

i18next
  .use(typeof window === 'undefined' ?
    // Server-side language detection
    new LanguageDetector(null, {
      order: ['querystring', 'header'],
      lookupQuerystring: 'lng'
    }) :
    // Client-side language detection
    new LngDetector(null, {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lng'
    }))
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ru: {
        translation: ruTranslation
      }
    }
  });
