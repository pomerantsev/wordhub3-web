export const SEED_DATE = '2012-01-01';

// This affects how soon the app will unexpectedly log out
// on page load (if not getting the page back from service worker).
// Setting expiration basically to infinity. It's not practical
// to set an earlier expiration date than that of the token,
// which currently doesn't expire
export const COOKIE_EXPIRATION_DAYS = 365 * 20;

export const MAX_REPETITIONS = 3;
export const MIN_DIFF_DAYS_FIRST_REPETITION = 1;
export const MAX_DIFF_DAYS_FIRST_REPETITION = 3;

export const credentialsKey = 'wordhubCredentials';

export const defaultAuthedPath = '/flashcards/new';
export const defaultUnauthedPath = '/';

export const appName = 'Wordhub';
export const titleDelimiter = '—';
