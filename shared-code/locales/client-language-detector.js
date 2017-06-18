import BrowserLanguageDetector from 'i18next-browser-languagedetector';
import {userPreferenceLookup} from './user-preference-lookup';

const userPreferenceDetector = {
  name: 'userPreference',

  lookup (options) {
    return userPreferenceLookup(options);
  }
};

export default class ClientLanguageDetector extends BrowserLanguageDetector {

  init (services, options = {}, i18nOptions = {}) {
    super.init(services, options, i18nOptions);
    this.addDetector(userPreferenceDetector);
  }

}
