import log from 'loglevel';

import moment from 'moment';
import {List, Map, OrderedMap} from 'immutable';
import escapeStringRegexp from 'escape-string-regexp';
import {createSelector, defaultMemoize} from 'reselect';

import * as constants from '../data/constants';
import * as helpers from '../utils/helpers';

export const getFlashcards = helpers.createDeepEqualSelector(
  [state => state.get('flashcards')],
  flashcards => flashcards.filter(flashcard => !flashcard.get('deleted'))
);

export const makeGetFlashcardWithComputedProps = defaultMemoize(uuid =>
  helpers.createDeepEqualSelector(
    [
      state => getFlashcards(state),
      state => getRepetitionsGroupedByFlashcard(state)
    ],
    (flashcards, repetitionsForFlashcard) => flashcards.get(uuid).set('learned',
      !!repetitionsForFlashcard.get(uuid).last().get('actualDate'))
  )
);

export const getBeefedUpFlashcardsWithComputedProps = helpers.createDeepEqualSelector(
  [state => getFlashcards(state).map(flashcard => makeGetFlashcardWithComputedProps(flashcard.get('uuid'))(state))],
  flashcards => flashcards
);

export const getRepetitions = helpers.createDeepEqualSelector(
  [
    state => getFlashcards(state),
    state => state.get('repetitions')
  ],
  (flashcards, repetitions) => repetitions.filter(repetition => flashcards.get(repetition.get('flashcardUuid')))
);

export const getRepetitionsIndexedByPlannedDay = helpers.createDeepEqualSelector(
  [
    state => getRepetitions(state)
  ],
  repetitions => {
    let repetitionsIndexedByPlannedDay = OrderedMap();
    repetitions.forEach(repetition => {
      repetitionsIndexedByPlannedDay = repetitionsIndexedByPlannedDay
        .updateIn([repetition.get('plannedDay'), 'repetitions'], List(), repetitionUuids =>
          repetitionUuids.push(repetition.get('uuid')));
    });
    return repetitionsIndexedByPlannedDay
      .sortBy(
        (value, key) => key,
        (a, b) => a - b
      )
      .map(repetitionsIndexForDay => repetitionsIndexForDay
        .set('completed', repetitionsIndexForDay.get('repetitions').every(repetitionUuid => !!repetitions.getIn([repetitionUuid, 'actualDate'])))
      );
  }
);

export const getRepetitionsForToday = helpers.createDeepEqualSelector(
  [
    state => getRepetitionsIndexedByPlannedDay(state),
    state => getRepetitions(state),
    state => getFlashcards(state),
    () => helpers.getCurrentDate()
  ],
  (repetitionsIndexedByPlannedDay, allRepetitions, flashcards, currentDate) => {
    const startTime = Date.now();
    const firstUncompletedDayRepetitionsKey = repetitionsIndexedByPlannedDay.findKey(
      repetitionsIndexForDay => !repetitionsIndexForDay.get('completed')
    );
    const todayRepetitions = (() => {
      if (firstUncompletedDayRepetitionsKey >= 0) {
        const plannedDay = repetitionsIndexedByPlannedDay.get(firstUncompletedDayRepetitionsKey);
        const repetitions = plannedDay.get('repetitions');
        if (repetitions.every(repetitionUuid => !allRepetitions.getIn([repetitionUuid, 'actualDate']))) {
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
                    (maxDate, repetitionUuid) => {
                      const repetition = allRepetitions.get(repetitionUuid);
                      return repetition.get('actualDate') > maxDate ? repetition.get('actualDate') : maxDate;
                    },
                    constants.SEED_DATE
                  )
              };
            })();
          const repetitionsFromPreviousDayRunToday = keyIndex === 0 ?
            List() :
            repetitionsIndexedByPlannedDay
              .getIn([previousDay.plannedDay, 'repetitions'])
              .filter(repetitionUuid => allRepetitions.getIn([repetitionUuid, 'actualDate']) >= currentDate);
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
          return repetitions
            .filter(repetitionUuid => {
              const repetition = allRepetitions.get(repetitionUuid);
              return !repetition.get('actualDate') || repetition.get('actualDate') >= currentDate;
            });
        }
      } else {
        return List();
      }
    })();

    const returnValue = todayRepetitions
      // We shouldn't need to filter anything out, just making sure that even if overall data
      // is inconsistent, all of today's repetitions have flashcards
      .filter(repetitionUuid => !!flashcards.get(allRepetitions.getIn([repetitionUuid, 'flashcardUuid'])));
    log.debug('Getter took ' + (Date.now() - startTime) + ' ms');
    return returnValue;
  }
);


export const getFlashcardsSorted = helpers.createDeepEqualSelector(
  [
    state => getBeefedUpFlashcardsWithComputedProps(state),
    state => state.get('searchString')
  ],
  (flashcards, searchString) => {
    const searchStringRegExp = new RegExp(escapeStringRegexp(searchString.toLowerCase()), 'i');
    return flashcards
      .filter(flashcard => searchString ?
        searchStringRegExp.test(flashcard.get('frontText')) ||
          searchStringRegExp.test(flashcard.get('backText')) :
        true
      )
      .valueSeq()
      .toList()
      .sort((flashcard1, flashcard2) =>
        helpers.compareStrings(flashcard2.get('creationDate'), flashcard1.get('creationDate')) ||
          flashcard2.get('createdAt') - flashcard1.get('createdAt'));
  }
);

export const getTodayFlashcards = createSelector(
  [
    state => getFlashcards(state),
    () => helpers.getCurrentDate()
  ],
  (flashcards, currentDate) => flashcards.filter(flashcard => flashcard.get('creationDate') === currentDate)
);

export const getLearnedFlashcards = createSelector(
  [state => getBeefedUpFlashcardsWithComputedProps(state)],
  flashcards => flashcards.filter(flashcard => flashcard.get('learned'))
);

export const getPlannedRepetitions = createSelector(
  [state => getRepetitions(state)],
  repetitions => repetitions.filter(repetition => !repetition.get('actualDate'))
);

export const getCurrentDay = helpers.createDeepEqualSelector(
  [
    state => getRepetitionsForToday(state),
    state => getRepetitions(state),
    state => getRepetitionsIndexedByPlannedDay(state)
  ],
  (todayRepetitions, repetitions, repetitionsIndexedByPlannedDay) => {
    if (todayRepetitions.size > 0) {
      return repetitions.getIn([todayRepetitions.get(0), 'plannedDay']);
    } else {
      const lastCompletedDay = repetitionsIndexedByPlannedDay
        .findLastKey(repetitionsIndexForDay => repetitionsIndexForDay.get('completed'));
      const currentDateMoment = moment(helpers.getCurrentDate());
      if (typeof lastCompletedDay === 'number') {
        const latestDateFromLastCompletedDay = repetitionsIndexedByPlannedDay.getIn([lastCompletedDay, 'repetitions'])
          .reduce((latestDate, repetitionUuid) => {
            const actualDate = repetitions.getIn([repetitionUuid, 'actualDate']);
            return actualDate > latestDate ? actualDate : latestDate;
          }, '');
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
    state => getRepetitionsIndexedByPlannedDay(state),
    () => helpers.getCurrentDate()
  ],
  (currentDay, repetitionsIndexedByPlannedDay, currentDate) => {
    const nextDay = repetitionsIndexedByPlannedDay
      .keySeq()
      .sort((a, b) => a - b)
      .find(day => day > currentDay);
    return nextDay ?
      Map({
        day: nextDay,
        date: moment(currentDate).add(nextDay - currentDay, 'days').format('YYYY-MM-DD'),
        repetitions: repetitionsIndexedByPlannedDay.getIn([nextDay, 'repetitions'])
      }) :
      null;
  }
);

export const getLastDayData = helpers.createDeepEqualSelector(
  [
    state => getCurrentDay(state),
    state => getRepetitionsIndexedByPlannedDay(state),
    () => helpers.getCurrentDate()
  ],
  (currentDay, repetitionsIndexedByPlannedDay, currentDate) => {
    const lastDay = repetitionsIndexedByPlannedDay
      .keySeq()
      .sort((a, b) => a - b)
      .last();
    return lastDay ?
      Map({
        day: lastDay,
        date: moment(currentDate).add(lastDay - currentDay, 'days').format('YYYY-MM-DD'),
        repetitions: repetitionsIndexedByPlannedDay.getIn([lastDay, 'repetitions'])
      }) :
      null;
  }
);

export const getIntervalStats = helpers.memoizeOneArg(dayCount => {
  return helpers.createDeepEqualSelector(
    [
      state => getFlashcards(state),
      state => getRepetitions(state),
      state => getRepetitionsGroupedByFlashcard(state),
      () => helpers.getCurrentDate()
    ],
    (flashcards, repetitions, repetitionsGroupedByFlashcard, currentDate) => {
      const startTimestamp = moment(currentDate).startOf('day').subtract(dayCount - 1, 'days');
      const startDate = helpers.getCurrentDate(startTimestamp);
      const allRepetitions = repetitions.filter(repetition => repetition.get('actualDate') >= startDate);
      return Map({
        flashcardsCreated: flashcards.filter(flashcard => flashcard.get('creationDate') >= startDate),
        flashcardsLearnedCount: repetitionsGroupedByFlashcard
          .filter(repetitionsForFlashcard =>
            repetitionsForFlashcard.last().get('actualDate') >= startDate
          )
          .size,
        allRepetitions,
        successfulRepetitions: allRepetitions.filter(repetition => repetition.get('successful'))
      });
    }
  );
});

export const getRepetitionsGroupedByFlashcard = helpers.createDeepEqualSelector(
  [
    state => getRepetitions(state)
  ],
  (repetitions) => {
    let repetitionsGroupedByFlashcard = Map();
    repetitions.forEach(repetition => {
      repetitionsGroupedByFlashcard = repetitionsGroupedByFlashcard
        .update(repetition.get('flashcardUuid'), List(), repetitionsForFlashcard => repetitionsForFlashcard.push(repetition));
    });
    return repetitionsGroupedByFlashcard.map(repetitionsForFlashcard =>
      repetitionsForFlashcard
        .sort((rep1, rep2) => rep1.get('seq') - rep2.get('seq'))
    );
  }
);

export const getRemainingRepetitionsForToday = helpers.createDeepEqualSelector(
  [
    state => getRepetitionsForToday(state),
    state => getRepetitions(state)
  ],
  (repetitionsForToday, allRepetitions) => repetitionsForToday
    .filter(repetitionUuid => !allRepetitions.getIn([repetitionUuid, 'actualDate']))
);
