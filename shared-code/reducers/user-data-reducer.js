import log from 'loglevel';

import {fromJS, Map} from 'immutable';

import * as constants from '../data/constants';
import * as getters from '../data/getters';
import * as helpers from '../utils/helpers';

function getStateWithCurrentRepetition (state) {
  const currentRepetition = state.get('currentRepetition');
  const remainingRepetitionsForToday = getters.getRemainingRepetitionsForToday(state);
  if (remainingRepetitionsForToday.indexOf(currentRepetition) > -1) {
    return state;
  } else if (remainingRepetitionsForToday.size > 0) {
    return state
      .set('currentRepetition', remainingRepetitionsForToday.get(Math.floor(Math.random() * remainingRepetitionsForToday.size)));
  } else {
    return state
      .set('currentRepetition', null);
  }
}

export default function userDataReducer (state, action) {
  switch (action.type) {

  case 'CREATE_FLASHCARD': {
    const flashcardCreationDay = getters.getCurrentDay(state);
    const newFlashcard = fromJS({
      uuid: action.flashcardUuid,
      frontText: action.frontText,
      backText: action.backText,
      creationDate: helpers.getCurrentDate(action.currentTime),
      creationDay: flashcardCreationDay,
      createdAt: action.currentTime,
      updatedAt: action.currentTime
    });
    const newRepetition = fromJS({
      uuid: action.repetitionUuid,
      flashcardUuid: action.flashcardUuid,
      seq: 1,
      plannedDay: flashcardCreationDay + action.diffDays,
      createdAt: action.currentTime,
      updatedAt: action.currentTime
    });
    const updatedState = state
      .update('flashcards',
        flashcards => flashcards.set(action.flashcardUuid, newFlashcard)
      )
      .update('repetitions',
        repetitions => repetitions.set(action.repetitionUuid, newRepetition)
      );

    return updatedState;
  }

  case 'UPDATE_FLASHCARD': {
    return state
      .updateIn(['flashcards', action.flashcardUuid], flashcard =>
        flashcard
          .set('frontText', action.frontText)
          .set('backText', action.backText)
          .set('updatedAt', action.currentTime)
      );
  }

  case 'DELETE_FLASHCARD': {
    const updatedState = state
      .updateIn(['flashcards', action.flashcardUuid], flashcard =>
        flashcard
          .set('deleted', true)
          .set('updatedAt', action.currentTime)
      )
      .set('recentlyDeletedFlashcard', action.flashcardUuid);
    return getStateWithCurrentRepetition(updatedState);
  }

  case 'UNDO_FLASHCARD_DELETION': {
    const updatedState = state
      .updateIn(['flashcards', state.get('recentlyDeletedFlashcard')], flashcard =>
        flashcard
          .set('deleted', false)
          .set('updatedAt', action.currentTime)
      )
      .set('recentlyDeletedFlashcard', null);
    return getStateWithCurrentRepetition(updatedState);
  }

  case 'FINALIZE_FLASHCARD_DELETION': {
    return state
      .set('recentlyDeletedFlashcard', null);
  }

  case 'RUN_REPETITION': {
    const startTime = Date.now();
    const updatedRepetition = state.getIn(['repetitions', action.repetitionUuid])
      .set('actualDate', helpers.getCurrentDate(action.currentTime))
      .set('successful', action.successful)
      .set('updatedAt', action.currentTime);

    const stateWithUpdatedRepetition = state
      .setIn(['repetitions', action.repetitionUuid], updatedRepetition);

    const nextRepetition = (() => {
      const allRepetitionsForFlashcard = stateWithUpdatedRepetition.get('repetitions')
        .filter(repetition => repetition.get('flashcardUuid') === stateWithUpdatedRepetition.getIn(['repetitions', action.repetitionUuid, 'flashcardUuid']))
        .toList()
        .sort((repetition1, repetition2) => repetition1.get('seq') - repetition2.get('seq'));
      const lastUnsuccessfulIndex = allRepetitionsForFlashcard.findLastIndex(repetition => !repetition.get('successful'));
      const successStreakLength = allRepetitionsForFlashcard.size - lastUnsuccessfulIndex - 1;
      if (successStreakLength >= constants.MAX_REPETITIONS) {
        return null;
      }
      // There can either be 1 or more repetitions, but never zero,
      // because we're running a repetition for the given flashcard now.
      const previousDay = allRepetitionsForFlashcard.size === 1 ?
        state.getIn(['flashcards', updatedRepetition.get('flashcardUuid'), 'creationDay']) :
        allRepetitionsForFlashcard.getIn([allRepetitionsForFlashcard.size - 2, 'plannedDay']);
      const diffDays = successStreakLength === 0 ?
        constants.MIN_DIFF_DAYS_FIRST_REPETITION +
          Math.floor(Math.random() * (constants.MAX_DIFF_DAYS_FIRST_REPETITION - constants.MIN_DIFF_DAYS_FIRST_REPETITION + 1)) :
        (() => {
          const interval = updatedRepetition.get('plannedDay') - previousDay;
          return interval * 2 + Math.floor(Math.random() * (interval + 1));
        })();
      return fromJS({
        uuid: action.nextRepetitionUuid,
        flashcardUuid: updatedRepetition.get('flashcardUuid'),
        seq: updatedRepetition.get('seq') + 1,
        plannedDay: updatedRepetition.get('plannedDay') + diffDays,
        createdAt: action.currentTime,
        updatedAt: action.currentTime
      });
    })();

    const stateWithAddedNextRepetition = nextRepetition ?
      (() => {
        const stateWithAddedRepetition =
          stateWithUpdatedRepetition
            .update('repetitions', repetitions => repetitions.set(action.nextRepetitionUuid, nextRepetition));
        return stateWithAddedRepetition;
      })() :
      stateWithUpdatedRepetition;
    log.debug('Reducer took ' + (Date.now() - startTime) + ' ms');
    return getStateWithCurrentRepetition(stateWithAddedNextRepetition);
  }

  case 'READ_DB': {
    const updatedState = state
      .set('flashcards', action.flashcards)
      .set('repetitions', action.repetitions)
      .set('lastSyncClientTime', action.lastSyncClientTime)
      .set('lastSyncServerTime', action.lastSyncServerTime)
      .set('userSettings', action.userSettings);
    return getStateWithCurrentRepetition(updatedState);
  }

  case 'SYNC_DATA_REQUEST': {
    return state
      .set('lastSyncRequestClientTime', Date.now());
  }

  case 'SYNC_DATA_FAILURE': {
    // Make sure that even if initial request fails
    // (we're offline), we still display the UI.
    return state
      .set('lastSyncRequestClientTime', null)
      .set('initialLoadingCompleted', true);
  }

  case 'SYNC_DATA': {
    const startTime = Date.now();
    const result = fromJS(action.result);
    const existingFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        state.get('flashcards').find(flashcard => helpers.flashcardsEqual(flashcard, receivedFlashcard)));
    const newFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        !state.get('flashcards').find(flashcard => helpers.flashcardsEqual(flashcard, receivedFlashcard)));
    const existingRepetitions = result.get('repetitions').filter(receivedRepetition =>
        state.get('repetitions').find(repetition => helpers.repetitionsEqual(repetition, receivedRepetition)));
    const newRepetitions = result.get('repetitions').filter(receivedRepetition =>
        !state.get('repetitions').find(repetition => helpers.repetitionsEqual(repetition, receivedRepetition)));

    const updatedState = state
      .set('syncError', null)
      .set('initialLoadingCompleted', true)
      .set('lastSyncClientTime', state.get('lastSyncRequestClientTime'))
      .set('lastSyncRequestClientTime', null)
      .set('lastSyncServerTime', result.get('updatedAt'))
      .update('flashcards', flashcards => flashcards
        .map(flashcard => {
          const flashcardFromServer = existingFlashcards
            .find(existingFlashcard => helpers.flashcardsEqual(existingFlashcard, flashcard));
          return flashcardFromServer ?
            flashcard
              .set('frontText', flashcardFromServer.get('frontText'))
              .set('backText', flashcardFromServer.get('backText'))
              .set('deleted', flashcardFromServer.get('deleted')) :
            flashcard;
        })
        .merge(Map(newFlashcards.map(flashcard => [flashcard.get('uuid'), flashcard])))
      )
      .update('repetitions', repetitions => repetitions
        .map(repetition => {
          const repetitionFromServer = existingRepetitions
            .find(existingRepetition => helpers.repetitionsEqual(existingRepetition, repetition));
          return repetitionFromServer ?
            repetitionFromServer :
            repetition;
        })
        .merge(Map(newRepetitions.map(repetition => [repetition.get('uuid'), repetition])))
      );

    log.debug('SyncData reducer took ' + (Date.now() - startTime) + ' ms');
    return getStateWithCurrentRepetition(updatedState);
  }
  case 'SET_SYNC_ERROR': {
    return state
      .set('syncError', action.errorCode);
  }
  case 'SEARCH_STRING_CHANGE': {
    return state
      .set('searchString', action.value);
  }
  case 'SET_LAST_CURRENT_DATE': {
    const updatedState = state
      .set('lastCurrentDate', action.value);
    return getStateWithCurrentRepetition(updatedState);
  }
  case 'SET_DATE_UPDATE_INTERVAL_ID': {
    return state
      .set('dateUpdateIntervalId', action.intervalId);
  }
  case 'SET_USER_SETTINGS': {
    const userSettings = fromJS(action.userSettings);
    return state
      .set('userSettings', userSettings);
  }
  default:
    return state;
  }
}
