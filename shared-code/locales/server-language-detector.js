import {LanguageDetector} from 'i18next-express-middleware';
import {userPreferenceLookup} from './user-preference-lookup';

const userPreferenceDetector = {
  name: 'userPreference',

  lookup (req, res, options) {
    return userPreferenceLookup(options);
  }
};

export default class ServerLanguageDetector extends LanguageDetector {

  init (services, options = {}, i18nOptions = {}) {
    super.init(services, options, i18nOptions);
    this.addDetector(userPreferenceDetector);
  }

}
