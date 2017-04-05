import {Map} from 'immutable';
import uuid from 'uuid';

import * as constants from '../data/constants';
import * as api from './api';
import * as storage from './storage';
import * as authUtils from '../utils/auth-utils';

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
    storage.storeCredentials(
      getState().get('credentials', Map()).merge(credentials),
      setCookieOnServer
    );
    return {type: 'STORE_CREDENTIALS', credentials};
  };
}

export function login (email, password) {
  return function (dispatch) {
    return {
      type: 'LOGIN',
      promise: api.login(email, password)
        .then(credentials => {
          if (credentials.token) {
            dispatch(storeCredentials(credentials));
            dispatch(syncData());
          }
        })
    };
  };
}

export function logout (setCookieOnServer) {
  return function (dispatch) {
    storage.deleteCredentials(setCookieOnServer);
    dispatch(resetLoggedInState());
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
    dispatch(createFlashcardLocal(frontText, backText, currentTime, flashcardUuid, repetitionUuid, diffDays));
    dispatch(syncData());
  };
}

export function createFlashcardLocal (frontText, backText, currentTime, flashcardUuid, repetitionUuid, diffDays) {
  return {type: 'CREATE_FLASHCARD', frontText, backText, currentTime, flashcardUuid, repetitionUuid, diffDays};
}

export function updateFlashcard (flashcardUuid, frontText, backText) {
  const currentTime = Date.now();
  return function (dispatch) {
    dispatch(() => ({type: 'UPDATE_FLASHCARD', flashcardUuid, frontText, backText, currentTime}));
    dispatch(syncData());
  };
}

// export function changeFlashcardFrontText (uuid, text) {
//   return {type: 'CHANGE_FLASHCARD_FRONT_TEXT', uuid, text};
// }

// export function memorizeRepetition (uuid) {
//   return {type: 'MEMORIZE_REPETITION', uuid};
// }

export function syncData () {
  return function (dispatch, getState) {
    const syncSince = getState().getIn(['userData', 'lastSyncClientTime']) || 0;
    const flashcards = getState().getIn(['userData', 'flashcards'])
      .filter(flashcard => flashcard.get('updatedAt') > syncSince)
      .map(flashcard => ({
        uuid: flashcard.get('uuid'),
        frontText: flashcard.get('frontText'),
        backText: flashcard.get('backText'),
        deleted: flashcard.get('deleted')
      }));
    const repetitions = getState().getIn(['userData', 'repetitions'])
      .filter(repetition => repetition.get('updatedAt') > syncSince)
      .map(repetition => ({
        uuid: repetition.get('uuid'),
        flashcardUuid: repetition.get('flashcardUuid'),
        seq: repetition.get('seq'),
        plannedDay: repetition.get('plannedDay'),
        actualDate: repetition.get('actualDate'),
        successful: repetition.get('successful')
      }));

    // TODO: we have to ensure data is sorted before sending it.
    return {
      type: 'SYNC_DATA',
      promise: api.syncData(
        getState().getIn(['credentials', 'token']),
        getState().getIn(['userData', 'lastSyncServerTime']) || 0,
        {
          flashcards,
          repetitions
        }
      )
    };
  };
}

// export function resetSendDataTime () {
//   return {type: 'RESET_SEND_DATA_TIME'};
// }
