import {fromJS} from 'immutable';
import moment from 'moment';
import uuid from 'uuid';

import * as constants from '../data/constants';

const DEFAULT_INITIAL_STATE = fromJS({
  newFlashcardText: '',
  flashcards: [],
  repetitions: [],
  date: moment().format('YYYY-MM-DD'),
  lastSyncServerTime: 0,
  lastSyncClientTime: 0,
  lastSyncRequestClientTime: 0
});

const INITIAL_STATE = (() => {
  try {
    return fromJS(JSON.parse(localStorage.getItem('wordhubData'))) || DEFAULT_INITIAL_STATE;
  } catch (e) {
    return DEFAULT_INITIAL_STATE;
  }
})();

export default function reducer (state = INITIAL_STATE, action = {}) {
  const updatedState = getUpdatedState(state, action);
  localStorage.setItem('wordhubData', JSON.stringify(updatedState.toJS()));
  return updatedState;
}

const MIN_DATE_DIFF = 1;
const MAX_DATE_DIFF = 3;

function getUpdatedState (state, action) {
  switch (action.type) {
  case 'CHANGE_DATE':
    return state
      .set('date', action.date);
  case 'CHANGE_NEW_FLASHCARD_TEXT':
    return state
      .set('newFlashcardText', action.text);
  case 'CREATE_FLASHCARD': {
    // TODO: make sure a repetition is never planned for a day earlier than
    // the earliest not completed one.
    const currentTime = Date.now();
    if (state.get('newFlashcardText')) {
      const flashcardUuid = uuid.v4();
      const flashcardCreationDay = moment(state.get('date')).diff(moment(constants.SEED_DATE), 'days');
      return state
        .update('flashcards',
          flashcards => flashcards.push(fromJS({
            uuid: flashcardUuid,
            frontText: state.get('newFlashcardText'),
            createdAt: currentTime,
            updatedAt: currentTime
          }))
        )
        .update('repetitions',
          repetitions => repetitions.push(fromJS({
            uuid: uuid.v4(),
            flashcardUuid,
            seq: 1,
            plannedDay: flashcardCreationDay + MIN_DATE_DIFF + Math.floor(Math.random() * (MAX_DATE_DIFF - MIN_DATE_DIFF + 1)),
            createdAt: currentTime,
            updatedAt: currentTime
          }))
        )
        .set('newFlashcardText', '');
    } else {
      return state;
    }
  }
  case 'CHANGE_FLASHCARD_FRONT_TEXT': {
    const currentTime = Date.now();
    const index = state.get('flashcards').findIndex(flashcard => flashcard.get('uuid') === action.uuid);
    return state
      .updateIn(['flashcards', index], flashcard =>
        flashcard.set('frontText', action.text)
          .set('updatedAt', currentTime)
      );
  }
  case 'MEMORIZE_REPETITION': {
    const currentTime = Date.now();
    const index = state.get('repetitions').findIndex(repetition => repetition.get('uuid') === action.uuid);
    const updatedRepetition = state.getIn(['repetitions', index])
      .set('actualDate', state.get('date'))
      .set('updatedAt', currentTime);
    return state
      .setIn(['repetitions', index], updatedRepetition)
      .update('repetitions', repetitions => updatedRepetition.get('seq') < constants.MAX_REPETITIONS ?
        repetitions.push(fromJS({
          uuid: uuid.v4(),
          flashcardUuid: updatedRepetition.get('flashcardUuid'),
          seq: updatedRepetition.get('seq') + 1,
          plannedDay: updatedRepetition.get('seq') === 1 ?
            updatedRepetition.get('plannedDay') + 5 + Math.floor(Math.random() * 6) :
            updatedRepetition.get('plannedDay') + 20 + Math.floor(Math.random() * 11),
          createdAt: currentTime,
          updatedAt: currentTime
        })) :
        repetitions
      );
  }

  case 'SYNC_DATA_REQUEST': {
    return state
      .set('lastSyncRequestClientTime', Date.now());
  }

  case 'SYNC_DATA': {
    const currentTime = Date.now();
    const result = fromJS(action.result);
    const existingFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        state.get('flashcards').find(flashcard => flashcard.get('uuid') === receivedFlashcard.get('uuid')));
    const newFlashcards = result.get('flashcards').filter(receivedFlashcard =>
        !state.get('flashcards').find(flashcard => flashcard.get('uuid') === receivedFlashcard.get('uuid')));
    const existingRepetitions = result.get('repetitions').filter(receivedRepetition =>
        state.get('repetitions').find(repetition => repetition.get('uuid') === receivedRepetition.get('uuid')));
    const newRepetitions = result.get('repetitions').filter(receivedRepetition =>
        !state.get('repetitions').find(repetition => repetition.get('uuid') === receivedRepetition.get('uuid')));

    // TODO: are we sure it's the same request?
    // Handle the case when request didn't go through.
    return state
      .set('lastSyncClientTime', state.get('lastSyncRequestClientTime'))
      .set('lastSyncServerTime', result.get('updatedAt'))
      .update('flashcards', flashcards => flashcards
        .map(flashcard => {
          const flashcardFromServer = existingFlashcards
            .find(existingFlashcard => existingFlashcard.get('uuid') === flashcard.get('uuid'));
          return flashcardFromServer ?
            flashcard
              .set('frontText', flashcardFromServer.get('frontText')) :
            flashcard;
        })
        .concat(newFlashcards.map(flashcardFromServer => flashcardFromServer.merge({
          createdAt: currentTime,
          updatedAt: 0
        })))
      )
      .update('repetitions', repetitions => repetitions
        .map(repetition => {
          const repetitionFromServer = existingRepetitions
            .find(existingRepetition => existingRepetition.get('uuid') === repetition.get('uuid'));
          return repetitionFromServer ?
            repetition
              .set('actualDate', repetitionFromServer.get('actualDate')) :
            repetition;
        })
        .concat(newRepetitions.map(repetitionFromServer => repetitionFromServer.merge({
          createdAt: currentTime,
          updatedAt: 0
        })))
      );
  }

  case 'RESET_SEND_DATA_TIME': {
    return state
      .set('lastSyncClientTime', 0);
  }

  default:
    return state;
  }
}
