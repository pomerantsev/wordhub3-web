import {getI18n} from '../locales/i18n';

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
    api.signup({
      email,
      password,
      name,
      language: getI18n().language
    })
      .then(credentials => {
        dispatch(loginSuccess(email, credentials));
      });
  };
}

export function resetLoggedInState () {
  return {type: 'RESET_LOGGED_IN_STATE'};
}

export function createFlashcard (frontText, backText) {
  const currentTime = Date.now();
  const flashcardUuid = uuid.v4();
  const repetitionUuid = uuid.v4();
  const diffDays = constants.MIN_DIFF_DAYS_FIRST_REPETITION +
    Math.floor(Math.random() * (constants.MAX_DIFF_DAYS_FIRST_REPETITION - constants.MIN_DIFF_DAYS_FIRST_REPETITION + 1));
  return function (dispatch) {
    dispatch(updateCurrentDate());
    dispatch(() => ({type: 'CREATE_FLASHCARD', frontText, backText, currentTime, flashcardUuid, repetitionUuid, diffDays}));
    dispatch(syncData());
  };
}

export function updateFlashcard (flashcardUuid, frontText, backText) {
  const currentTime = Date.now();
  return function (dispatch) {
    dispatch(updateCurrentDate());
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
    dispatch(updateCurrentDate());
    dispatch(() => ({type: 'RUN_REPETITION', repetitionUuid, successful, currentTime, nextRepetitionUuid}));
    dispatch(syncData());
  };
}

export function readDb () {
  return function (dispatch, getState) {
    dbStorage.getData(getState().get('openLocalDbPromise'))
      .then(({flashcards, repetitions, lastSyncClientTime, lastSyncServerTime}) => {
        dispatch(() => ({
          type: 'READ_DB',
          flashcards: Map(flashcards.map(flashcard => [flashcard.uuid, fromJS(flashcard)])),
          repetitions: Map(repetitions.map(repetition => [repetition.uuid, fromJS(repetition)])),
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
    dispatch(updateCurrentDate());
    const syncDataActionStart = Date.now();
    const syncSince = getState().getIn(['userData', 'lastSyncClientTime']);
    console.log('Flashcards:', getState().getIn(['userData', 'flashcards']));
    const flashcards = getState().getIn(['userData', 'flashcards'])
      .filter(flashcard => flashcard.get('updatedAt') > syncSince)
      .valueSeq()
      .toList()
      .toJS();
    const repetitions = getState().getIn(['userData', 'repetitions'])
      .filter(repetition => repetition.get('updatedAt') > syncSince)
      .valueSeq()
      .toList()
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
            .toList()
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

export function searchStringChange (value) {
  return {type: 'SEARCH_STRING_CHANGE', value};
}

export function updateCurrentDate () {
  return function (dispatch, getState) {
    const newCurrentDate = moment().format('YYYY-MM-DD');
    if (newCurrentDate !== getState().getIn(['userData', 'lastCurrentDate'])) {
      dispatch(setLastCurrentDate(newCurrentDate));
    }
  };
}

export function setLastCurrentDate (value) {
  return function (dispatch) {
    dispatch(() => ({type: 'SET_LAST_CURRENT_DATE', value}));
    dispatch(() => ({type: 'UPDATE_REPETITIONS_FOR_TODAY'}));
  };
}

export function storeUserAgent (userAgent) {
  return {type: 'STORE_USER_AGENT', userAgent};
}
