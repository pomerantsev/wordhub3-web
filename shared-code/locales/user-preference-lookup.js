import * as helpers from '../utils/helpers';

export function userPreferenceLookup (options) {
  const languageId = options.getUserLanguageId();
  if (typeof languageId === 'number') {
    const foundLanguage = helpers.getLanguage(languageId);
    if (foundLanguage) {
      return foundLanguage.name;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
