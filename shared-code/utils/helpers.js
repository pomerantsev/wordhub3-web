import moment from 'moment';
import {createSelectorCreator, defaultMemoize} from 'reselect';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => typeof a === 'object' && typeof b === 'object' ? a.equals(b) : a === b
);

export function getPaginatedLink (pathname, page) {
  return page === 1 ?
    pathname :
    `${pathname}?page=${page}`;
}

export function flashcardsEqual (flashcard1, flashcard2) {
  return flashcard1.get('uuid') === flashcard2.get('uuid');
}

export function repetitionsEqual (repetition1, repetition2) {
  return repetition1.get('flashcardUuid') === repetition2.get('flashcardUuid') &&
    repetition1.get('seq') === repetition2.get('seq');
}

export function getCurrentDate (timestamp = Date.now()) {
  return moment(timestamp).format('YYYY-MM-DD');
}

export function memoizeOneArg (func) {
  const memo = {};
  return function (arg) {
    if (!memo[arg]) {
      memo[arg] = func(arg);
    }
    return memo[arg];
  };
}

export function getRoundedPercentageString (value, precision = 0) {
  if (isNaN(value)) {
    return '0%';
  }
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier * 100) / multiplier + '%';
}

// Used in sorting algorithms, similarly to int1 - int2
// which sorts in ascending order
export function compareStrings (string1, string2) {
  if (string1 > string2) {
    return 1;
  } else if (string1 < string2) {
    return -1;
  } else {
    return 0;
  }
}

export function getIndexedDB () {
  // Only enable indexedDB in Chrome for now - performance in Safari and Firefox
  // seems to be too low.
  return typeof window !== 'undefined' &&
    /Chrome/.test(navigator.userAgent) &&
    window.indexedDB;

}
