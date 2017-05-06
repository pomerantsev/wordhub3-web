import {fromJS, Map} from 'immutable';
import uuid from 'uuid';
import moment from 'moment';

import * as constants from '../data/constants';
import * as api from './api';
import * as storage from './storage';
import * as dbStorage from './db-storage';
import * as authUtils from '../utils/auth-utils';
import * as helpers from '../utils/helpers';

export function rehydrateCredentials (credentialsFromRequest, setCookieOnServer) {
  const credentials = credentialsFromRequest || storage.getCredentials();
  return function (dispatch, getState) {
    if (credentials) {
      dispatch(storeCredentials(credentials, setCookieOnServer));
    } else if (authUtils.isLoggedIn(getState())) {
      dispatch(logout(setCookieOnServer));
    }
  };
}

export function storeCredentials (credentials, setCookieOnServer) {
  return function (dispatch, getState) {
    const updatedCredentials = getState().get('credentials', Map()).merge(credentials);
    storage.storeCredentials(updatedCredentials, setCookieOnServer);
    console.log('Before openLocalDb');
    if (!setCookieOnServer) {
      dispatch(openLocalDb(updatedCredentials.get('email')));
    }
    return {type: 'STORE_CREDENTIALS', credentials};
  };
}

export function login (email, password) {
  return function (dispatch) {
    // TODO: handle unsuccessful login
    api.login(email, password)
      .then(credentials => {
        dispatch(loginSuccess(email, credentials));
      });
  };
}

export function loginSuccess (email, credentials) {
  return function (dispatch) {
    if (credentials.token) {
      dispatch(storeCredentials(Object.assign({}, credentials, {email})));
      dispatch(startLoggedInState());
    }
  };
}

export function startLoggedInState () {
  return function (dispatch) {
    dispatch(setLastCurrentDate(helpers.getCurrentDate()));
    dispatch(readDb());
  };
}

export function openLocalDb (email) {
  return {
    type: 'OPEN_LOCAL_DB',
    promise: dbStorage.openDb(email)
  };
}

export function logout (setCookieOnServer) {
  return function (dispatch) {
    storage.deleteCredentials(setCookieOnServer);
    dispatch(resetLoggedInState());
  };
}

export function signup (email, password, name) {
  return function (dispatch) {
    // TODO: Handle unsuccessful signup
    api.signup(email, password, name)
      .then(credentials => {
        dispatch(loginSuccess(email, credentials));
      });
  };
}

export function resetLoggedInState () {
  return {type: 'RESET_LOGGED_IN_STATE'};
}

// export function changeDate (date) {
//   return {type: 'CHANGE_DATE', date};
// }

// export function changeNewFlashcardText (text) {
//   return {type: 'CHANGE_NEW_FLASHCARD_TEXT', text};
// }

export function createFlashcard (frontText, backText) {
  const currentTime = Date.now();
  const flashcardUuid = uuid.v4();
  const repetitionUuid = uuid.v4();
  const diffDays = constants.MIN_DIFF_DAYS_FIRST_REPETITION +
    Math.floor(Math.random() * (constants.MAX_DIFF_DAYS_FIRST_REPETITION - constants.MIN_DIFF_DAYS_FIRST_REPETITION + 1));
  return function (dispatch) {
    dispatch(() => ({type: 'CREATE_FLASHCARD', frontText, backText, currentTime, flashcardUuid, repetitionUuid, diffDays}));
    dispatch(syncData());
  };
}

export function updateFlashcard (flashcardUuid, frontText, backText) {
  const currentTime = Date.now();
  return function (dispatch) {
    dispatch(() => ({type: 'UPDATE_FLASHCARD', flashcardUuid, frontText, backText, currentTime}));
    window.setTimeout(() => {
      dispatch(() => ({type: 'UPDATE_REPETITIONS_FOR_TODAY'}));
      dispatch(syncData());
    });
  };
}

export function runRepetition (repetitionUuid, successful) {
  const currentTime = Date.now();
  const nextRepetitionUuid = uuid.v4();
  return function (dispatch) {
    dispatch(() => ({type: 'RUN_REPETITION_UPDATE_TODAY', repetitionUuid, successful, currentTime}));
    window.setTimeout(() => {
      dispatch(() => ({type: 'RUN_REPETITION', repetitionUuid, successful, currentTime, nextRepetitionUuid}));
      dispatch(syncData());
    }, 0);
  };
}

// export function changeFlashcardFrontText (uuid, text) {
//   return {type: 'CHANGE_FLASHCARD_FRONT_TEXT', uuid, text};
// }

// export function memorizeRepetition (uuid) {
//   return {type: 'MEMORIZE_REPETITION', uuid};
// }

export function readDb () {
  return function (dispatch, getState) {
    dbStorage.getData(getState().get('openLocalDbPromise'))
      .then(({flashcards, repetitions, lastSyncClientTime, lastSyncServerTime}) => {
        dispatch(() => ({
          type: 'READ_DB',
          flashcards: fromJS(flashcards),
          repetitions: fromJS(repetitions),
          lastSyncClientTime,
          lastSyncServerTime
        }));
        dispatch(syncData());
      });
  };
}

export function syncData () {
  // TODO: if sync request was unsuccessful (an error returned),
  // make sure client doesn't go out of sync with server.
  // For example, show that we're offline if request failed.
  // If server returned a 400 response, prompt user to either
  // delete new flashcards / repetitions or retry.
  return function (dispatch, getState) {
    const newCurrentDate = moment().format('YYYY-MM-DD');
    if (newCurrentDate !== getState().getIn(['userData', 'lastCurrentDate'])) {
      dispatch(setLastCurrentDate(newCurrentDate));
    }

    const syncDataActionStart = Date.now();
    const syncSince = getState().getIn(['userData', 'lastSyncClientTime']);
    const flashcards = getState().getIn(['userData', 'flashcards'])
      .filter(flashcard => flashcard.get('updatedAt') > syncSince)
      .toJS();
    const repetitions = getState().getIn(['userData', 'repetitions'])
      .filter(repetition => repetition.get('updatedAt') > syncSince)
      .toJS();

    console.log('Sync data action took ' + (Date.now() - syncDataActionStart) + ' ms');

    dbStorage.writeData(getState().get('openLocalDbPromise'), {
      flashcards: flashcards,
      repetitionUuidsToDelete: [],
      newRepetitions: repetitions
    });

    // TODO: we have to ensure data is sorted before sending it.
    return {
      type: 'SYNC_DATA',
      promise: api.syncData(
        getState().getIn(['credentials', 'token']),
        getState().getIn(['userData', 'lastSyncServerTime']),
        {
          flashcards,
          repetitions
        }
      ).then(result => {
        // Writing data to DB happens asynchronously and independently from the
        // in-memory representation of data.
        dbStorage.writeData(getState().get('openLocalDbPromise'), {
          flashcards: result.flashcards,
          repetitionUuidsToDelete: getState()
            .getIn(['userData', 'repetitions'])
            .filter(repetition => fromJS(result.repetitions).find(repetitionFromServer => helpers.repetitionsEqual(repetition, repetitionFromServer)))
            .map(repetition => repetition.get('uuid'))
            .toJS(),
          newRepetitions: result.repetitions,
          assortedValues: {
            lastSyncClientTime: getState().getIn(['userData', 'lastSyncRequestClientTime']),
            lastSyncServerTime: result.updatedAt
          }
        });
        dispatch(setOnline(true));
        return result;
      }).catch(error => {
        if (!error.status) {
          // We're offline!
          dispatch(setOnline(false));
        }
        // TODO: Handle a server error response - can we do something meaningful here?
        throw error;
      })
    };
  };
}

export function setOnline (online) {
  return {type: 'SET_ONLINE', online};
}

// export function resetSendDataTime () {
//   return {type: 'RESET_SEND_DATA_TIME'};
// }

export function searchStringChange (value) {
  return {type: 'SEARCH_STRING_CHANGE', value};
}

export function setLastCurrentDate (value) {
  return function (dispatch) {
    dispatch(() => ({type: 'SET_LAST_CURRENT_DATE', value}));
    dispatch(() => ({type: 'UPDATE_REPETITIONS_FOR_TODAY'}));
  };
}
