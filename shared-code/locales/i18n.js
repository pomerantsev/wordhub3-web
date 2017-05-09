import i18next from 'i18next';

let i18n;

if (typeof window !== 'undefined') {
  i18n = i18next;
}

export function setI18n (newI18n) {
  i18n = newI18n;
}

export function getI18n () {
  return i18n;
}
