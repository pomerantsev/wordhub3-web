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
