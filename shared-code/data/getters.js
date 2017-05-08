import moment from 'moment';
import {List, Map} from 'immutable';
import escapeStringRegexp from 'escape-string-regexp';
import {createSelector} from 'reselect';

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
      .valueSeq()
      .toList()
      .sort((flashcard1, flashcard2) => flashcard2.get('createdAt') - flashcard1.get('createdAt'));
  }
);

export const getLearnedFlashcards = createSelector(
  [state => state.get('flashcards')],
  flashcards => flashcards.filter(flashcard => flashcard.get('learned'))
);

export const getPlannedRepetitions = createSelector(
  [state => state.get('repetitions')],
  repetitions => repetitions.filter(repetition => !repetition.get('actualDate'))
);

export const getTodayRepetitionsFromMainState = helpers.createDeepEqualSelector(
  [
    state => state.get('repetitionsIndexedByPlannedDay'),
    state => state.get('flashcards'),
    () => helpers.getCurrentDate()
  ],
  (repetitionsIndexedByPlannedDay, flashcards, currentDate) => {
    const startTime = Date.now();
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
          const repetitionsFromPreviousDayRunToday = keyIndex === 0 ?
            List() :
            repetitionsIndexedByPlannedDay
              .getIn([previousDay.plannedDay, 'repetitions'])
              .filter(repetition => repetition.get('actualDate') >= currentDate);
          if (repetitionsFromPreviousDayRunToday.size > 0) {
            return repetitionsFromPreviousDayRunToday;
          } else {
            const dateDifference = moment(currentDate).diff(previousDay.actualDate, 'days');
            return dateDifference >= firstUncompletedDayRepetitionsKey - previousDay.plannedDay ?
              repetitions :
              List();
          }
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

    const returnValue = todayRepetitions
      .map(repetition => repetition.set('flashcard',
        flashcards.get(repetition.get('flashcardUuid'))))
      // We shouldn't need to filter anything out, just making sure that even if overall data
      // is inconsistent, all of today's repetitions have flashcards
      .filter(repetition => !!repetition.get('flashcard'));
    console.log('Getter took ' + (Date.now() - startTime) + ' ms');
    return returnValue;
  }
);

// TODO: creating a deep equal selector might be overkill.
export const getTodayRepetitions = helpers.createDeepEqualSelector(
  [
    state => state.get('repetitionsForToday')
  ],
  repetitionsForToday => repetitionsForToday
);

export const getCurrentDay = helpers.createDeepEqualSelector(
  [
    state => getTodayRepetitions(state),
    state => state.get('repetitionsIndexedByPlannedDay')
  ],
  (todayRepetitions, repetitionsIndexedByPlannedDay) => {
    if (todayRepetitions.size > 0) {
      return todayRepetitions.getIn([0, 'plannedDay']);
    } else {
      const lastCompletedDay = repetitionsIndexedByPlannedDay
        .findLastKey(repetitionsIndexForDay => repetitionsIndexForDay.get('completed'));
      const currentDateMoment = moment(helpers.getCurrentDate());
      if (typeof lastCompletedDay === 'number') {
        const latestDateFromLastCompletedDay = repetitionsIndexedByPlannedDay.getIn([lastCompletedDay, 'repetitions'])
          .reduce((latestDate, repetition) =>
            repetition.get('actualDate') > latestDate ? repetition.get('actualDate') : latestDate, '');
        const daysSinceLastCompleted = currentDateMoment.diff(latestDateFromLastCompletedDay, 'days');
        return lastCompletedDay + daysSinceLastCompleted;
      } else {
        return currentDateMoment.diff(constants.SEED_DATE, 'days');
      }
    }
  }
);

export const getNextDayData = helpers.createDeepEqualSelector(
  [
    state => getCurrentDay(state),
    state => state.get('repetitionsIndexedByPlannedDay')
  ],
  (currentDay, repetitionsIndexedByPlannedDay) => {
    const nextDay = repetitionsIndexedByPlannedDay
      .keySeq()
      .sort((a, b) => a - b)
      .find(day => day > currentDay);
    return nextDay ?
      Map({
        day: nextDay,
        date: moment(helpers.getCurrentDate()).add(nextDay - currentDay, 'days').format('YYYY-MM-DD'),
        repetitions: repetitionsIndexedByPlannedDay.getIn([nextDay, 'repetitions'])
      }) :
      null;
  }
);

export const getLastDayData = helpers.createDeepEqualSelector(
  [
    state => getCurrentDay(state),
    state => state.get('repetitionsIndexedByPlannedDay')
  ],
  (currentDay, repetitionsIndexedByPlannedDay) => {
    const lastDay = repetitionsIndexedByPlannedDay
      .keySeq()
      .sort((a, b) => a - b)
      .last();
    return lastDay ?
      Map({
        day: lastDay,
        date: moment(helpers.getCurrentDate()).add(lastDay - currentDay, 'days').format('YYYY-MM-DD'),
        repetitions: repetitionsIndexedByPlannedDay.getIn([lastDay, 'repetitions'])
      }) :
      null;
  }
);
