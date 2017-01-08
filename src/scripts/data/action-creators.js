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
