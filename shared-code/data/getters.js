import moment from 'moment';
import {List} from 'immutable';
import escapeStringRegexp from 'escape-string-regexp';

import * as constants from '../data/constants';
import * as helpers from '../utils/helpers';

export const getFlashcardsSorted = helpers.createDeepEqualSelector(
  [
    state => state.getIn(['userData', 'flashcards']),
    state => state.getIn(['userData', 'searchString'])
  ],
  (flashcards, searchString) => {
    const searchStringRegExp = new RegExp(escapeStringRegexp(searchString));
    return flashcards
      .filter(flashcard => searchString ?
        searchStringRegExp.test(flashcard.get('frontText')) ||
          searchStringRegExp.test(flashcard.get('backText')) :
        true
      )
      .sort((flashcard1, flashcard2) => flashcard2.get('createdAt') - flashcard1.get('createdAt'));
  }
);

export const getTodayRepetitions = helpers.createDeepEqualSelector(
  [
    state => state.getIn(['userData', 'repetitionsIndexedByPlannedDay']),
    state => state.getIn(['userData', 'flashcards']),
    state => state.getIn(['userData', 'currentDate'])
  ],
  (repetitionsIndexedByPlannedDay, flashcards, currentDate) => {
    const firstUncompletedDayRepetitionsKey = repetitionsIndexedByPlannedDay.findKey(
      repetitionsIndexForDay => !repetitionsIndexForDay.get('completed')
    );
    const todayRepetitions = (() => {
      if (firstUncompletedDayRepetitionsKey >= 0) {
        const plannedDay = repetitionsIndexedByPlannedDay.get(firstUncompletedDayRepetitionsKey);
        const repetitions = plannedDay.get('repetitions');
        if (repetitions.every(repetition => !repetition.get('actualDate'))) {
          // No repetitions for this day have been run
          const keyIndex = repetitionsIndexedByPlannedDay.keySeq().findIndex(key => key === firstUncompletedDayRepetitionsKey);
          const previousDay = keyIndex === 0 ?
            {actualDate: constants.SEED_DATE, plannedDay: 0} :
            (() => {
              const previousPlannedDay = repetitionsIndexedByPlannedDay.keySeq().get(keyIndex - 1);
              return {
                plannedDay: previousPlannedDay,
                actualDate: repetitionsIndexedByPlannedDay.getIn([previousPlannedDay, 'repetitions'])
                  .reduce(
                    (maxDate, repetition) => repetition.get('actualDate') > maxDate ? repetition.get('actualDate') : maxDate,
                    constants.SEED_DATE
                  )
              };
            })();
          const dateDifference = moment(currentDate).diff(previousDay.actualDate, 'days');
          return dateDifference >= firstUncompletedDayRepetitionsKey - previousDay.plannedDay ?
            repetitions :
            List();
        } else {
          // Some repetitions have been run - we can return all repetitions that have not been run
          // or whose current date is greater or equals than current as today's
          return repetitions.filter(repetition =>
            !repetition.get('actualDate') || repetition.get('actualDate') >= currentDate);
        }
      } else {
        return List();
      }
    })();

    return todayRepetitions
      .map(repetition => repetition.set('flashcard',
        flashcards.find(flashcard => flashcard.get('uuid') === repetition.get('flashcardUuid'))))
      // We shouldn't need to filter anything out, just making sure that even if overall data
      // is inconsistent, all of today's repetitions have flashcards
      .filter(repetition => !!repetition.get('flashcard'));
  }
);
