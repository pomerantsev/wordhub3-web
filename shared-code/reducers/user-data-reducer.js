import {fromJS, List, Map} from 'immutable';
import moment from 'moment';

import * as constants from '../data/constants';
import * as getters from '../data/getters';

export default function userDataReducer (state, action/*, credentials*/) {
  const updatedState = getUpdatedState(state, action);
  // const userId = credentials.get('userId');
  // const storedUserData = localStorage.getItem('userData');
  // if (storedUserData) {
  //   try {
  //     const newUserData = JSON.stringify(Object.assign({}, JSON.parse(storedUserData), {
  //       [userId]: updatedState.toJS()
  //     }));
  //     localStorage.setItem('userData', newUserData);
  //   } catch (e) {
  //     const newUserData = JSON.stringify({
  //       [userId]: updatedState.toJS()
  //     });
  //     localStorage.setItem('userData', newUserData);
  //   }
  // } else {
  //   const newUserData = JSON.stringify({
  //     [userId]: updatedState.toJS()
  //   });
  //   localStorage.setItem('userData', newUserData);
  // }
  return updatedState;
}

function getUpdatedState (state, action) {
  switch (action.type) {

  case 'CREATE_FLASHCARD': {
    const flashcardCreationDay = getters.getCurrentDay(state);
    const newFlashcard = fromJS({
      uuid: action.flashcardUuid,
      frontText: action.frontText,
      backText: action.backText,
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
    return state
      .update('flashcards',
        flashcards => flashcards.push(newFlashcard)
      )
      .update('repetitions',
        repetitions => repetitions.push(newRepetition)
      )
      .updateIn(
        ['repetitionsIndexedByPlannedDay', newRepetition.get('plannedDay')],
        Map(),
        repetitionsIndexForDay => {
          const updatedRepetitions = repetitionsIndexForDay.get('repetitions', List()).push(newRepetition);
          return repetitionsIndexForDay
            .set('repetitions', updatedRepetitions)
            .set('completed', updatedRepetitions.every(repetition => !!repetition.get('actualDate')));
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
      .update('flashcards', flashcards => flashcards.map(flashcard =>
        flashcard.get('uuid') === action.flashcardUuid ?
          flashcard
            .set('frontText', action.frontText)
            .set('backText', action.backText)
            .set('updatedAt', action.currentTime) :
          flashcard
      ));
  }

  case 'RUN_REPETITION': {
    const startTime = Date.now();
    const returnValue = (() => {
      const repetitionIndex = state.get('repetitions').findIndex(repetition =>
        repetition.get('uuid') === action.repetitionUuid);
      const updatedRepetition = state.getIn(['repetitions', repetitionIndex])
        .set('actualDate', state.get('currentDate'))
        .set('successful', action.successful)
        .set('updatedAt', action.currentTime);

      const stateWithUpdatedRepetition = state
        .setIn(['repetitions', repetitionIndex], updatedRepetition)
        .updateIn(['repetitionsIndexedByPlannedDay', updatedRepetition.get('plannedDay')], repetitionsIndexForDay => {
          const repetitionIndexWithUpdatedRepetitions = repetitionsIndexForDay
            .update('repetitions', repetitions => repetitions.map(repetition =>
              repetition.get('uuid') === action.repetitionUuid ?
                updatedRepetition :
                repetition
            ));
          return repetitionIndexWithUpdatedRepetitions
            .set('completed', repetitionIndexWithUpdatedRepetitions.get('repetitions').every(repetition => !!repetition.get('actualDate')));
        });
      const nextRepetition = (() => {
        const allRepetitionsForFlashcard = stateWithUpdatedRepetition.get('repetitions')
          .filter(repetition => repetition.get('flashcardUuid') === stateWithUpdatedRepetition.getIn(['repetitions', repetitionIndex, 'flashcardUuid']))
          .sort((repetition1, repetition2) => repetition1.get('seq') - repetition2.get('seq'));
        const lastUnsuccessfulIndex = allRepetitionsForFlashcard.findLastIndex(repetition => !repetition.get('successful'));
        const successStreakLength = allRepetitionsForFlashcard.size - lastUnsuccessfulIndex - 1;
        if (successStreakLength >= constants.MAX_REPETITIONS) {
          return null;
        }
        // There can either be 1 or more repetitions, but never zero,
        // because we're running a repetition for the given flashcard now.
        const previousDay = allRepetitionsForFlashcard.size === 1 ?
          moment(
            state.get('flashcards')
              .find(flashcard => flashcard.get('uuid') === updatedRepetition.get('flashcardUuid'))
              .get('createdAt')
          ).diff(constants.SEED_DATE, 'days') :
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

      if (nextRepetition) {
        return stateWithUpdatedRepetition
          .update('repetitions', repetitions => repetitions.push(nextRepetition))
          .updateIn(
            ['repetitionsIndexedByPlannedDay', nextRepetition.get('plannedDay')],
            Map(),
            repetitionsIndexForDay => {
              const updatedRepetitions = repetitionsIndexForDay.get('repetitions', List()).push(nextRepetition);
              return repetitionsIndexForDay
                .set('repetitions', updatedRepetitions)
                .set('completed', updatedRepetitions.every(repetition => !!repetition.get('actualDate')));
            }
          )
          .update('repetitionsIndexedByPlannedDay', repetitionsIndexedByPlannedDay =>
            repetitionsIndexedByPlannedDay.sortBy(
              (value, key) => key,
              (a, b) => a - b
            )
          );
      } else {
        return stateWithUpdatedRepetition;
      }
    })();
    console.log('Reducer took ' + (Date.now() - startTime) + ' ms');
    return returnValue;
  }

  case 'SYNC_DATA_REQUEST': {
    return state
      .set('lastSyncRequestClientTime', Date.now());
  }

  case 'SYNC_DATA': {
    const syncDataStart = Date.now();
    const flashcardsEqual = (flashcard1, flashcard2) =>
      flashcard1.get('uuid') === flashcard2.get('uuid');
    const repetitionsEqual = (repetition1, repetition2) =>
      repetition1.get('flashcardUuid') === repetition2.get('flashcardUuid') &&
        repetition1.get('seq') === repetition2.get('seq');

    const result = fromJS(action.result);
    const existingFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        state.get('flashcards').find(flashcard => flashcardsEqual(flashcard, receivedFlashcard)));
    const newFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        !state.get('flashcards').find(flashcard => flashcardsEqual(flashcard, receivedFlashcard)));
    const existingRepetitions = result.get('repetitions').filter(receivedRepetition =>
        state.get('repetitions').find(repetition => repetitionsEqual(repetition, receivedRepetition)));
    const newRepetitions = result.get('repetitions').filter(receivedRepetition =>
        !state.get('repetitions').find(repetition => repetitionsEqual(repetition, receivedRepetition)));

    // TODO: are we sure it's the same request?
    // Handle the case when request didn't go through.
    const updatedState = state
      .set('lastSyncClientTime', state.get('lastSyncRequestClientTime'))
      .set('lastSyncServerTime', result.get('updatedAt'))
      .update('flashcards', flashcards => flashcards
        .map(flashcard => {
          const flashcardFromServer = existingFlashcards
            .find(existingFlashcard => flashcardsEqual(existingFlashcard, flashcard));
          return flashcardFromServer ?
            flashcard
              .set('frontText', flashcardFromServer.get('frontText'))
              .set('backText', flashcardFromServer.get('backText'))
              .set('deleted', flashcardFromServer.get('deleted')) :
            flashcard;
        })
        .concat(newFlashcards.map(flashcardFromServer => flashcardFromServer.merge({
          createdAt: flashcardFromServer.get('createdAt'),
          updatedAt: flashcardFromServer.get('updatedAt')
        })))
      )
      .update('repetitions', repetitions => repetitions
        .map(repetition => {
          const repetitionFromServer = existingRepetitions
            .find(existingRepetition => repetitionsEqual(existingRepetition, repetition));
          return repetitionFromServer ?
            repetitionFromServer :
            repetition;
        })
        .concat(newRepetitions)
      );

    let repetitionsIndexedByPlannedDay = updatedState.get('repetitionsIndexedByPlannedDay');

    existingRepetitions.forEach(existingRepetition => {
      const repetitionInState = updatedState.get('repetitions').find(repetition => repetitionsEqual(repetition, existingRepetition));
      repetitionsIndexedByPlannedDay = repetitionsIndexedByPlannedDay
        .updateIn([repetitionInState.get('plannedDay'), 'repetitions'], List(), repetitions =>
          repetitions.splice(repetitions.findIndex(repetition => repetitionsEqual(repetition, existingRepetition)), 1)
        )
        .updateIn([existingRepetition.get('plannedDay'), 'repetitions'], List(), repetitions =>
          repetitions.push(existingRepetition)
        );
    });

    newRepetitions.forEach(newRepetition => {
      repetitionsIndexedByPlannedDay = repetitionsIndexedByPlannedDay
        .updateIn([newRepetition.get('plannedDay'), 'repetitions'], List(), repetitions =>
          repetitions.push(newRepetition)
        );
    });

    const fullyUpdatedRepetitionsIndexByPlannedDay = repetitionsIndexedByPlannedDay
      .sortBy(
        (value, key) => key,
        (a, b) => a - b
      )
      .filter(repetitionsIndexForDay => repetitionsIndexForDay.get('repetitions').size > 0)
      .map(repetitionsIndexForDay => repetitionsIndexForDay
        .set('completed', repetitionsIndexForDay.get('repetitions').every(repetition => !!repetition.get('actualDate')))
      );

    console.log('Sync data reducer took ' + (Date.now() - syncDataStart) + ' ms');

    return updatedState
      .set('repetitionsIndexedByPlannedDay', fullyUpdatedRepetitionsIndexByPlannedDay);
  }
  case 'SEARCH_STRING_CHANGE': {
    return state
      .set('searchString', action.value);
  }
  case 'CURRENT_DATE_CHANGE': {
    return state
      .set('currentDate', action.value);
  }
  default:
    return state;
  }
}
