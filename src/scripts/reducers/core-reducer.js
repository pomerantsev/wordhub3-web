import {fromJS} from 'immutable';
import moment from 'moment';
import uuid from 'uuid';

import * as constants from '../data/constants';

const DEFAULT_INITIAL_STATE = fromJS({
  newFlashcardText: '',
  flashcards: [],
  repetitions: [],
  date: moment().format('YYYY-MM-DD')
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
  default:
    return state;
  }
}
