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
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier * 100) / multiplier + '%';
}
