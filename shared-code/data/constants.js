export const SEED_DATE = '2012-01-01';

// This affects how soon the app will unexpectedly log out
// on page load (if not getting the page back from service worker).
export const COOKIE_EXPIRATION_DAYS = 365;

export const MAX_REPETITIONS = 3;
export const MIN_DIFF_DAYS_FIRST_REPETITION = 1;
export const MAX_DIFF_DAYS_FIRST_REPETITION = 3;

export const credentialsKey = 'wordhubCredentials';

export const defaultAuthedPath = '/flashcards/new';
export const defaultUnauthedPath = '/';
