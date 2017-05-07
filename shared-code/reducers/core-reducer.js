import {fromJS, Map, OrderedMap} from 'immutable';

import * as authUtils from '../utils/auth-utils';

import userDataReducer from './user-data-reducer';

const INITIAL_CREDENTIALS = Map({});

const INITIAL_USER_DATA = fromJS({
  user: [],
  flashcards: [],
  repetitions: [],
  repetitionsIndexedByPlannedDay: OrderedMap(),
  repetitionsForToday: [],
  lastSyncServerTime: 0,
  lastSyncClientTime: 0,
  lastSyncRequestClientTime: 0,
  searchString: '',
  lastCurrentDate: ''
});

const INITIAL_STATE = fromJS({
  credentials: INITIAL_CREDENTIALS,
  userData: INITIAL_USER_DATA,
  online: true
});

export default function reducer (state = INITIAL_STATE, action = {}) {
  const updatedState = getUpdatedState(state, action);
  return updatedState;
}

function getUpdatedState (state, action) {
  switch (action.type) {
  case 'STORE_CREDENTIALS':
    return state
      .update('credentials',
        credentials => credentials.merge(action.credentials));
  case 'OPEN_LOCAL_DB_REQUEST':
    return state
      .set('openLocalDbPromise', action.promise);
  case 'RESET_LOGGED_IN_STATE':
    return state
      .set('credentials', INITIAL_CREDENTIALS)
      .set('userData', INITIAL_USER_DATA)
      .delete('openLocalDbPromise');

  case 'SET_ONLINE': {
    return state
      .set('online', action.online);
  }

  default:
    return state
      .update('userData', userData =>
        authUtils.isLoggedIn(state) ?
          userDataReducer(userData, action/*, state.get('credentials')*/) :
          userData
      );
  }
}
