import {Map} from 'immutable';

const INITIAL_STATE = Map();

export default function reducer (state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case 'BLAH':
    return state;
  }
  return state;
}
