import {createSelectorCreator, defaultMemoize} from 'reselect';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => typeof a === 'object' && typeof b === 'object' ? a.equals(b) : a === b
);
