import 'mocha';
import {assert} from 'chai';
import {fromJS, OrderedMap} from 'immutable';
import moment from 'moment';
import {getTodayRepetitionsFromMainState} from '../../shared-code/data/getters';

// This is not perfect - if we start testing some time at 23:59, some tests might fail if they run after 0:00.
const dateFormat = 'YYYY-MM-DD';
const today = moment().format(dateFormat);
const yesterday = moment(today).subtract(1, 'day').format(dateFormat);
const twoDaysAgo = moment(today).subtract(2, 'days').format(dateFormat);
const tomorrow = moment(today).add(1, 'day').format(dateFormat);

describe('getTodayRepetitionsFromMainState', () => {
  describe('when there are no repetitions', () => {
    it('returns an empty list', () => {
      const state = fromJS({
        flashcards: [],
        repetitionsIndexedByPlannedDay: OrderedMap()
      });
      assert.equal(0, getTodayRepetitionsFromMainState(state).size);
    });
  })

  describe('when there are some repetitions', () => {

    describe('when there is a plannedDay for which some but not all repetitions are run', () => {
      it('returns all reps for that plannedDay which have no actualDate or an actualDate >= currentDate', () => {
        const state = fromJS({
          flashcards: [
            {uuid: 1},
            {uuid: 2},
            {uuid: 3},
            {uuid: 4}
          ],
          repetitionsIndexedByPlannedDay: OrderedMap(fromJS({
            1: {
              completed: true,
              repetitions: [
                {uuid: 1, actualDate: twoDaysAgo, flashcardUuid: 1},
                {uuid: 2, actualDate: twoDaysAgo, flashcardUuid: 2}
              ]
            },
            2: {
              completed: false,
              repetitions: [
                {uuid: 3, actualDate: null, flashcardUuid: 3},
                {uuid: 4, actualDate: yesterday, flashcardUuid: 4},
                {uuid: 5, actualDate: today, flashcardUuid: 1},
                {uuid: 6, actualDate: tomorrow, flashcardUuid: 2}
              ]
            },
            4: {
              completed: false,
              repetitions: [
                {uuid: 7, actualDate: null, flashcardUuid: 1},
                {uuid: 8, actualDate: null, flashcardUuid: 2}
              ]
            }
          }))
        });

        const repetitions = getTodayRepetitionsFromMainState(state);
        assert.deepEqual([3, 5, 6], repetitions.toJS().map(repetition => repetition.uuid));
      })
    })

    describe('when there are no partially completed plannedDays', () => {

      describe('when latest completed plannedDay has among actualDate values >= currentDate', () => {
        it('returns repetitions with actualDate >= currentDate', () => {
          const state = fromJS({
            flashcards: [
              {uuid: 1},
              {uuid: 2},
              {uuid: 3},
              {uuid: 4}
            ],
            repetitionsIndexedByPlannedDay: OrderedMap(fromJS({
              1: {
                completed: true,
                repetitions: [
                  {uuid: 1, actualDate: twoDaysAgo, flashcardUuid: 1},
                  {uuid: 2, actualDate: twoDaysAgo, flashcardUuid: 2}
                ]
              },
              2: {
                completed: true,
                repetitions: [
                  {uuid: 3, actualDate: yesterday, flashcardUuid: 3},
                  {uuid: 4, actualDate: yesterday, flashcardUuid: 4},
                  {uuid: 5, actualDate: today, flashcardUuid: 1},
                  {uuid: 6, actualDate: tomorrow, flashcardUuid: 2}
                ]
              },
              4: {
                completed: false,
                repetitions: [
                  {uuid: 7, actualDate: null, flashcardUuid: 1},
                  {uuid: 8, actualDate: null, flashcardUuid: 2}
                ]
              }
            }))
          });

          const repetitions = getTodayRepetitionsFromMainState(state);
          assert.deepEqual([5, 6], repetitions.toJS().map(repetition => repetition.uuid));
        });
      });

    });

  })


});
