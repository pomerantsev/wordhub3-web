import {createSelectorCreator, defaultMemoize} from 'reselect';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => a.equals(b)
);
