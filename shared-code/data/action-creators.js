import i18next from 'i18next';

import log from 'loglevel';

import {fromJS, Map} from 'immutable';
import uuid from 'uuid';

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
    log.debug('Before openLocalDb');
    if (!setCookieOnServer) {
      dispatch(openLocalDb(updatedCredentials.get('email')));
    }
    return {type: 'STORE_CREDENTIALS', credentials};
  };
}

export function login (email, password) {
  return function (dispatch) {
    dispatch(() => ({type: 'LOGIN_REQUEST'}));
    api.login(email, password)
      .then(res => {
        return res.json().then(credentials => {
          dispatch(loginSuccess(email, credentials));
        });
      }, () => {
        dispatch(loginFailure(constants.ERROR_NETWORK));
      });
  };
}

export function loginSuccess (email, credentials) {
  return function (dispatch) {
    if (credentials.token) {
      dispatch(() => ({type: 'LOGIN_SUCCESS'}));
      dispatch(storeCredentials(Object.assign({}, credentials, {email})));
      dispatch(startLoggedInState());
    } else {
      dispatch(loginFailure(credentials.errorCode));
    }
  };
}

export function loginFailure (errorCode) {
  return {type: 'LOGIN_FAILURE', errorCode};
}

export function startLoggedInState () {
  return function (dispatch) {
    dispatch(updateCurrentDate());

    if (typeof window !== 'undefined') {
      // Check current date every second and update if necessary.
      const dateUpdateIntervalId =
        window.setInterval(() => dispatch(updateCurrentDate()), 1000);
      dispatch(setDateUpdateIntervalId(dateUpdateIntervalId));
    }

    dispatch(readDb());
  };
}

export function setDateUpdateIntervalId (intervalId) {
  return {type: 'SET_DATE_UPDATE_INTERVAL_ID', intervalId};
}

export function openLocalDb (email) {
  const indexedDB = helpers.getIndexedDB();
  return {
    type: 'OPEN_LOCAL_DB',
    indexedDB,
    promise: dbStorage.openDb(indexedDB, email)
  };
}

export function logout (setCookieOnServer) {
  return function (dispatch, getState) {
    storage.deleteCredentials(setCookieOnServer);
    window.clearInterval(getState().getIn(['userData', 'dateUpdateIntervalId']));
    dispatch(resetLoggedInState());
  };
}

export function signup (email, password, name) {
  return function (dispatch) {
    dispatch(() => ({type: 'SIGNUP_REQUEST'}));
    api.signup({
      email,
      password,
      name,
      language: i18next.language
    })
      .then(res => {
        return res.json().then(credentials => {
          if (credentials.token) {
            dispatch(loginSuccess(email, credentials));
          } else {
            dispatch(signupFailure(credentials.errorCode));
          }
        });
      }, () => {
        dispatch(signupFailure(constants.ERROR_NETWORK));
      });
  };
}

export function signupFailure (errorCode) {
  return {type: 'SIGNUP_FAILURE', errorCode};
}

export function resetLoggedInState () {
  return {type: 'RESET_LOGGED_IN_STATE'};
}

export async function storeUserSettings (token) {
  const settings = await api.getUserSettings(token);
  return {type: 'STORE_USER_SETTINGS', settings};
}

export function updateUserSettings ({dailyLimit, name, interfaceLanguageId}) {
  return function (dispatch, getState) {
    dispatch(() => ({type: 'UPDATE_USER_SETTINGS_REQUEST'}));
    api.updateUserSettings(getState().getIn(['credentials', 'token']), {
      dailyLimit,
      name,
      interfaceLanguageId
    }).then(res => {
      return res.json().then(data => {
        if (data.success) {
          dispatch(setOnline(true));
          const language = helpers.getLanguage(interfaceLanguageId);
          if (language) {
            helpers.changeLanguage(language.name);
          }
          dbStorage.writeUserSettings(getState().get('openLocalDbPromise'), {dailyLimit, name, interfaceLanguageId});
          dispatch(() => ({type: 'UPDATE_USER_SETTINGS_SUCCESS', dailyLimit, name, interfaceLanguageId}));
        } else {
          dispatch(updateUserSettingsFailure(data.errorCode));
        }
      });
    }, () => {
      dispatch(updateUserSettingsFailure(constants.ERROR_NETWORK));
    });
  };
}

export function updateUserSettingsFailure (errorCode) {
  return {type: 'UPDATE_USER_SETTINGS_FAILURE', errorCode};
}

export function userSettingsLeave () {
  return {type: 'USER_SETTINGS_LEAVE'};
}

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
    dispatch(syncData());
  };
}

export function deleteFlashcard (flashcardUuid) {
  const currentTime = Date.now();
  return function (dispatch) {
    dispatch(() => ({type: 'DELETE_FLASHCARD', flashcardUuid, currentTime}));
    dispatch(syncData());
  };
}

export function undoFlashcardDeletion () {
  const currentTime = Date.now();
  return function (dispatch) {
    dispatch(() => ({type: 'UNDO_FLASHCARD_DELETION', currentTime}));
    dispatch(syncData());
  };
}

export function finalizeFlashcardDeletion () {
  return {type: 'FINALIZE_FLASHCARD_DELETION'};
}

export function runRepetition (repetitionUuid, successful) {
  const currentTime = Date.now();
  const nextRepetitionUuid = uuid.v4();
  return function (dispatch) {
    dispatch(() => ({type: 'RUN_REPETITION', repetitionUuid, successful, currentTime, nextRepetitionUuid}));
    dispatch(syncData());
  };
}

export function readDb () {
  return function (dispatch, getState) {
    dbStorage.getData(getState().get('openLocalDbPromise'))
      .then(({flashcards, repetitions, lastSyncClientTime, lastSyncServerTime, userSettings}) => {
        dispatch(() => ({
          type: 'READ_DB',
          flashcards: Map(flashcards.map(flashcard => [flashcard.uuid, fromJS(flashcard)])),
          repetitions: Map(repetitions.map(repetition => [repetition.uuid, fromJS(repetition)])),
          lastSyncClientTime,
          lastSyncServerTime,
          userSettings: fromJS(userSettings)
        }));
        const language = helpers.getLanguage(getState().getIn(['userData', 'userSettings', 'interfaceLanguageId']));
        if (language) {
          helpers.changeLanguage(language.name);
        }
        dispatch(syncData());
      });
  };
}

export function syncData () {
  return function (dispatch, getState) {
    const syncDataActionStart = Date.now();
    const syncSince = getState().getIn(['userData', 'lastSyncClientTime']);
    log.debug('Flashcards:', getState().getIn(['userData', 'flashcards']));
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

    log.debug('Sync data action took ' + (Date.now() - syncDataActionStart) + ' ms');

    dbStorage.writeData(getState().get('openLocalDbPromise'), {
      flashcards: flashcards,
      repetitionUuidsToDelete: [],
      newRepetitions: repetitions
    });

    if (getState().getIn(['userData', 'lastSyncRequestClientTime'])) {
      // This means that a sync request is in progress,
      // so we just skip this one.
      // Ideally, we would probably like to chain sync requests,
      // but it currently seems overkill to me.
      return;
    }

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

        dispatch(setSyncError(null));
        dispatch(setUserSettings(result.userSettings));
        const language = helpers.getLanguage(result.userSettings.interfaceLanguageId);
        if (language) {
          helpers.changeLanguage(language.name);
        }

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
        if (error.status) {
          log.debug('Sync error:', error.body.message);
          dispatch(setSyncError(error.body.errorCode));
        } else {
          // We're offline!
          dispatch(setOnline(false));
        }
        throw error;
      })
    };
  };
}

export function setUserSettings (userSettings) {
  return function (dispatch, getState) {
    dbStorage.writeUserSettings(getState().get('openLocalDbPromise'), userSettings);
    return {type: 'SET_USER_SETTINGS', userSettings};
  };
}

export function setOnline (online) {
  return {type: 'SET_ONLINE', online};
}

export function setSyncError (errorCode) {
  return {type: 'SET_SYNC_ERROR', errorCode};
}

export function searchStringChange (value) {
  return {type: 'SEARCH_STRING_CHANGE', value};
}

export function updateCurrentDate () {
  return function (dispatch, getState) {
    const newCurrentDate = helpers.getCurrentDate();
    if (newCurrentDate !== getState().getIn(['userData', 'lastCurrentDate'])) {
      dispatch(() => ({type: 'SET_LAST_CURRENT_DATE', value: newCurrentDate}));
    }
  };
}

export function storeUserAgent (userAgent) {
  return {type: 'STORE_USER_AGENT', userAgent};
}
