import {Map} from 'immutable';

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
      getState().getIn(['user', 'credentials'], Map()).merge(credentials),
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

export function changeDate (date) {
  return {type: 'CHANGE_DATE', date};
}

export function changeNewFlashcardText (text) {
  return {type: 'CHANGE_NEW_FLASHCARD_TEXT', text};
}

export function createFlashcard () {
  return {type: 'CREATE_FLASHCARD'};
}

export function changeFlashcardFrontText (uuid, text) {
  return {type: 'CHANGE_FLASHCARD_FRONT_TEXT', uuid, text};
}

export function memorizeRepetition (uuid) {
  return {type: 'MEMORIZE_REPETITION', uuid};
}

export function syncData () {
  return function (dispatch, getState) {
    const syncSince = getState().get('lastSyncClientTime') || 0;
    const flashcards = getState().get('flashcards')
      .filter(flashcard => flashcard.get('updatedAt') > syncSince)
      .map(flashcard => ({
        uuid: flashcard.get('uuid'),
        frontText: flashcard.get('frontText')
      }));
    const repetitions = getState().get('repetitions')
      .filter(repetition => repetition.get('updatedAt') > syncSince)
      .map(repetition => ({
        uuid: repetition.get('uuid'),
        flashcardUuid: repetition.get('flashcardUuid'),
        seq: repetition.get('seq'),
        plannedDay: repetition.get('plannedDay'),
        actualDate: repetition.get('actualDate')
      }));

    // TODO: we have to ensure data is sorted before sending it.
    return {
      type: 'SYNC_DATA',
      promise: api.syncData(getState().get('lastSyncServerTime') || 0, {
        flashcards,
        repetitions
      })
    };
  };
}

export function resetSendDataTime () {
  return {type: 'RESET_SEND_DATA_TIME'};
}
