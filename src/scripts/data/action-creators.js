import * as sync from './sync';

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

export function getData (timestamp) {
  return {
    type: 'GET_DATA',
    promise: sync.getData(timestamp)
  };
}

export function sendData () {
  return function (dispatch, getState) {
    const syncSince = getState().get('lastSyncClientTime') || 0;
    console.log(syncSince);
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
      type: 'SEND_DATA',
      promise: sync.sendData({
        flashcards,
        repetitions
      })
    };
  };
}

export function resetSendDataTime () {
  return {type: 'RESET_SEND_DATA_TIME'};
}
