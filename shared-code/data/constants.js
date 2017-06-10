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

export const LOGIN_INCORRECT_DATA = 1;

export const SIGNUP_EMAIL_INVALID = 1;
export const SIGNUP_EMAIL_TOO_LONG = 2;
export const SIGNUP_PASSWORD_TOO_SHORT = 3;
export const SIGNUP_PASSWORD_TOO_LONG = 4;
export const SIGNUP_PASSWORD_INVALID = 5;
export const SIGNUP_NAME_TOO_LONG = 6;
export const SIGNUP_EXISTING_USER = 7;

export const MAX_EMAIL_LENGTH = 100;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 25;
export const MAX_NAME_LENGTH = 25;
export const PASSWORD_REGEX = /^[0-9a-zA-Z]+$/;
