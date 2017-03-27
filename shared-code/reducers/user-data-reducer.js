import {fromJS} from 'immutable';

export default function userDataReducer (state, action, credentials) {
  const updatedState = getUpdatedState(state, action);
  const userId = credentials.get('userId');
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    try {
      const newUserData = JSON.stringify(Object.assign({}, JSON.parse(storedUserData), {
        [userId]: updatedState.toJS()
      }));
      localStorage.setItem('userData', newUserData);
    } catch (e) {
      const newUserData = JSON.stringify({
        [userId]: updatedState.toJS()
      });
      localStorage.setItem('userData', newUserData);
    }
  } else {
    const newUserData = JSON.stringify({
      [userId]: updatedState.toJS()
    });
    localStorage.setItem('userData', newUserData);
  }
  return updatedState;
}

function getUpdatedState (state, action) {
  switch (action.type) {

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
              .set('frontText', flashcardFromServer.get('frontText'))
              .set('backText', flashcardFromServer.get('backText'))
              .set('deleted', flashcardFromServer.get('deleted')) :
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
              .set('actualDate', repetitionFromServer.get('actualDate'))
              .set('successful', repetitionFromServer.get('successful')) :
            repetition;
        })
        .concat(newRepetitions.map(repetitionFromServer => repetitionFromServer.merge({
          createdAt: currentTime,
          updatedAt: 0
        })))
      );
  }
  default:
    return state;
  }
}
