import {fromJS, List, Map} from 'immutable';

import * as constants from '../data/constants';
import * as getters from '../data/getters';
import * as helpers from '../utils/helpers';

function getStateWithCurrentRepetition (state) {
  const currentRepetition = state.get('currentRepetition');
  const remainingRepetitionsForToday = state.get('repetitionsForToday')
    .filter(repetitionUuid => !state.getIn(['repetitions', repetitionUuid, 'actualDate']));
  if (remainingRepetitionsForToday.indexOf(currentRepetition) > -1) {
    return state;
  } else if (remainingRepetitionsForToday.size > 0) {
    // TODO: can we do without this randomness?
    return state
      .set('currentRepetition', remainingRepetitionsForToday.get(Math.floor(Math.random() * remainingRepetitionsForToday.size)));
  } else {
    return state
      .set('currentRepetition', null);
  }
}

function getStateWithUpdatedRepetitionIndices (state, existingRepetitions, newRepetitions) {
  let repetitionsIndexedByPlannedDay = state.get('repetitionsIndexedByPlannedDay');

  existingRepetitions.forEach(existingRepetition => {
    const repetitionInState = state.get('repetitions').find(repetition => helpers.repetitionsEqual(repetition, existingRepetition));
    repetitionsIndexedByPlannedDay = repetitionsIndexedByPlannedDay
      .updateIn([repetitionInState.get('plannedDay'), 'repetitions'], List(), repetitionUuids =>
        repetitionUuids.splice(repetitionUuids.findIndex(repetitionUuid => helpers.repetitionsEqual(state.getIn(['repetitions', repetitionUuid]), existingRepetition)), 1)
      )
      .updateIn([existingRepetition.get('plannedDay'), 'repetitions'], List(), repetitionUuids =>
        repetitionUuids.push(existingRepetition.get('uuid'))
      );
  });

  newRepetitions.forEach(newRepetition => {
    repetitionsIndexedByPlannedDay = repetitionsIndexedByPlannedDay
      .updateIn([newRepetition.get('plannedDay'), 'repetitions'], List(), repetitionUuids =>
        repetitionUuids.push(newRepetition.get('uuid'))
      );
  });

  const fullyUpdatedRepetitionsIndexByPlannedDay = repetitionsIndexedByPlannedDay
    .sortBy(
      (value, key) => key,
      (a, b) => a - b
    )
    .filter(repetitionsIndexForDay => repetitionsIndexForDay.get('repetitions').size > 0)
    .map(repetitionsIndexForDay => repetitionsIndexForDay
      .set('completed', repetitionsIndexForDay.get('repetitions').every(repetitionUuid => !!state.getIn(['repetitions', repetitionUuid, 'actualDate'])))
    );

  const stateWithUpdatedRepetitionsIndexedByPlannedDay =
    state
      .set('repetitionsIndexedByPlannedDay', fullyUpdatedRepetitionsIndexByPlannedDay);

  const repetitionsForToday = getters.getTodayRepetitionsFromMainState(stateWithUpdatedRepetitionsIndexedByPlannedDay);

  const stateWithUpdatedRepetitionsForToday = stateWithUpdatedRepetitionsIndexedByPlannedDay
    .set('repetitionsForToday', repetitionsForToday);

  return getStateWithCurrentRepetition(stateWithUpdatedRepetitionsForToday);
}

export default function userDataReducer (state, action) {
  switch (action.type) {

  case 'CREATE_FLASHCARD': {
    const flashcardCreationDay = getters.getCurrentDay(state);
    const newFlashcard = fromJS({
      uuid: action.flashcardUuid,
      frontText: action.frontText,
      backText: action.backText,
      creationDay: flashcardCreationDay,
      createdAt: action.currentTime,
      updatedAt: action.currentTime,
      // An aggregate property that's not used by the backend
      learned: false
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

    return updatedState
      .updateIn(
        ['repetitionsIndexedByPlannedDay', newRepetition.get('plannedDay')],
        Map(),
        repetitionsIndexForDay => {
          const updatedRepetitions = repetitionsIndexForDay.get('repetitions', List()).push(newRepetition.get('uuid'));
          return repetitionsIndexForDay
            .set('repetitions', updatedRepetitions)
            .set('completed', updatedRepetitions.every(repetitionUuid => !!updatedState.getIn(['repetitions', repetitionUuid, 'actualDate'])));
        }
      )
      .update('repetitionsIndexedByPlannedDay', repetitionsIndexedByPlannedDay =>
        repetitionsIndexedByPlannedDay.sortBy(
          (value, key) => key,
          (a, b) => a - b
        )
      );
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

  case 'UPDATE_REPETITIONS_FOR_TODAY': {
    const stateWithUpdatedRepetitionsForToday = state
      .set('repetitionsForToday', getters.getTodayRepetitionsFromMainState(state));
    return getStateWithCurrentRepetition(stateWithUpdatedRepetitionsForToday);
  }

  case 'RUN_REPETITION': {
    const startTime = Date.now();
    const updatedRepetition = state.getIn(['repetitions', action.repetitionUuid])
      .set('actualDate', helpers.getCurrentDate(action.currentTime))
      .set('successful', action.successful)
      .set('updatedAt', action.currentTime);

    const stateWithUpdatedRepetition = state
      .setIn(['repetitions', action.repetitionUuid], updatedRepetition);

    const stateWithUpdatedRepetitionAndIndex = stateWithUpdatedRepetition
      .updateIn(['repetitionsIndexedByPlannedDay', updatedRepetition.get('plannedDay')], repetitionsIndexForDay => {
        return repetitionsIndexForDay
          .set('completed', repetitionsIndexForDay.get('repetitions').every(repetitionUuid => !!stateWithUpdatedRepetition.getIn(['repetitions', repetitionUuid, 'actualDate'])));
      });
    const nextRepetition = (() => {
      const allRepetitionsForFlashcard = stateWithUpdatedRepetitionAndIndex.get('repetitions')
        .filter(repetition => repetition.get('flashcardUuid') === stateWithUpdatedRepetitionAndIndex.getIn(['repetitions', action.repetitionUuid, 'flashcardUuid']))
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
      // TODO: here's a random component, which is not ideal in a reducer,
      // but we'll stick with it for now.
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
          stateWithUpdatedRepetitionAndIndex
            .update('repetitions', repetitions => repetitions.set(action.nextRepetitionUuid, nextRepetition));
        return stateWithAddedRepetition
          .updateIn(
            ['repetitionsIndexedByPlannedDay', nextRepetition.get('plannedDay')],
            Map(),
            repetitionsIndexForDay => {
              const updatedRepetitions = repetitionsIndexForDay.get('repetitions', List()).push(nextRepetition.get('uuid'));
              return repetitionsIndexForDay
                .set('repetitions', updatedRepetitions)
                .set('completed', updatedRepetitions.every(repetitionUuid => !!stateWithAddedRepetition.getIn(['repetitions', repetitionUuid, 'actualDate'])));
            }
          )
          .update('repetitionsIndexedByPlannedDay', repetitionsIndexedByPlannedDay =>
            repetitionsIndexedByPlannedDay.sortBy(
              (value, key) => key,
              (a, b) => a - b
            )
          );
      })() :
      stateWithUpdatedRepetitionAndIndex;
    const returnValue = stateWithAddedNextRepetition
      .updateIn(
        ['flashcards', updatedRepetition.get('flashcardUuid')],
        flashcard => flashcard.set('learned', !nextRepetition)
      );
    console.log('Reducer took ' + (Date.now() - startTime) + ' ms');
    return returnValue;
  }

  case 'READ_DB': {
    const updatedState = state
      .set('flashcards', action.flashcards)
      .set('repetitions', action.repetitions)
      .set('lastSyncClientTime', action.lastSyncClientTime)
      .set('lastSyncServerTime', action.lastSyncServerTime);
    return getStateWithUpdatedRepetitionIndices(updatedState, List(), action.repetitions);
  }

  case 'SYNC_DATA_REQUEST': {
    return state
      .set('lastSyncRequestClientTime', Date.now());
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

    // TODO: are we sure it's the same request?
    // Handle the case when request didn't go through.
    const updatedState = state
      .set('initialLoadingCompleted', true)
      .set('lastSyncClientTime', state.get('lastSyncRequestClientTime'))
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

    const lastRepetitionActualDates = getters.getRepetitionsGroupedByFlashcard(updatedState)
      .map(repetitionsForFlashcard => repetitionsForFlashcard
        .last()
        .get('actualDate')
      );
    const stateWithUpdatedFlashcardLearned = updatedState
      .update('flashcards', flashcards => flashcards.map(flashcard =>
        flashcard.set('learned', !!lastRepetitionActualDates.get(flashcard.get('uuid')))));

    const stateWithUpdatedRepetitionIndices = getStateWithUpdatedRepetitionIndices(stateWithUpdatedFlashcardLearned, existingRepetitions, newRepetitions);
    console.log('SyncData reducer took ' + (Date.now() - startTime) + ' ms');
    return stateWithUpdatedRepetitionIndices;
  }
  case 'SEARCH_STRING_CHANGE': {
    return state
      .set('searchString', action.value);
  }
  case 'SET_LAST_CURRENT_DATE': {
    return state
      .set('lastCurrentDate', action.value);
  }
  default:
    return state;
  }
}
