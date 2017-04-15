import {fromJS} from 'immutable';
import moment from 'moment';

import * as constants from '../data/constants';

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
    const flashcardCreationDay = moment(action.currentTime).diff(moment(constants.SEED_DATE), 'days');
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

  case 'SYNC_DATA_REQUEST': {
    return state
      .set('lastSyncRequestClientTime', Date.now());
  }

  case 'SYNC_DATA': {
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
    return state
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
            repetition
              .set('uuid', repetitionFromServer.get('uuid'))
              .set('actualDate', repetitionFromServer.get('actualDate'))
              .set('successful', repetitionFromServer.get('successful')) :
            repetition;
        })
        .concat(newRepetitions.map(repetitionFromServer => repetitionFromServer.merge({
          createdAt: repetitionFromServer.get('createdAt'),
          updatedAt: repetitionFromServer.get('updatedAt')
        })))
      );
  }
  case 'SEARCH_STRING_CHANGE': {
    return state
      .set('searchString', action.value);
  }
  default:
    return state;
  }
}
