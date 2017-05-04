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
