import 'mocha';
import {assert} from 'chai';
import {fromJS, OrderedMap} from 'immutable';
import {getTodayRepetitions} from '../../shared-code/data/getters';

describe('getTodayRepetitions', () => {
  describe('when there are no repetitions', () => {
    it('returns an empty list', () => {
      const state = fromJS({
        userData: {
          currentDate: '2012-01-02',
          flashcards: [],
          repetitionsIndexedByPlannedDay: OrderedMap()
        }
      });
      assert.equal(0, getTodayRepetitions(state).size);
    });
  })

  describe('when there are some repetitions', () => {

    describe('when there is a plannedDay for which some but not all repetitions are run', () => {
      it('returns all reps for that plannedDay which have no actualDate or an actualDate >= currentDate', () => {
        const state = fromJS({
          userData: {
            currentDate: '2012-01-04',
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
                  {uuid: 1, actualDate: '2012-01-02', flashcardUuid: 1},
                  {uuid: 2, actualDate: '2012-01-02', flashcardUuid: 2}
                ]
              },
              2: {
                completed: false,
                repetitions: [
                  {uuid: 3, actualDate: null, flashcardUuid: 3},
                  {uuid: 4, actualDate: '2012-01-03', flashcardUuid: 4},
                  {uuid: 5, actualDate: '2012-01-04', flashcardUuid: 1},
                  {uuid: 6, actualDate: '2012-01-05', flashcardUuid: 2}
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
          }
        });

        const repetitions = getTodayRepetitions(state);
        assert.deepEqual([3, 5, 6], repetitions.toJS().map(repetition => repetition.uuid));
      })
    })

    describe('when there are no partially completed plannedDays', () => {

      describe('when latest completed plannedDay has among actualDate values >= currentDate', () => {
        it('returns repetitions with actualDate >= currentDate', () => {
          const state = fromJS({
            userData: {
              currentDate: '2012-01-04',
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
                    {uuid: 1, actualDate: '2012-01-02', flashcardUuid: 1},
                    {uuid: 2, actualDate: '2012-01-02', flashcardUuid: 2}
                  ]
                },
                2: {
                  completed: true,
                  repetitions: [
                    {uuid: 3, actualDate: '2012-01-03', flashcardUuid: 3},
                    {uuid: 4, actualDate: '2012-01-03', flashcardUuid: 4},
                    {uuid: 5, actualDate: '2012-01-04', flashcardUuid: 1},
                    {uuid: 6, actualDate: '2012-01-05', flashcardUuid: 2}
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
            }
          });

          const repetitions = getTodayRepetitions(state);
          assert.deepEqual([5, 6], repetitions.toJS().map(repetition => repetition.uuid));
        });
      });

    });

  })


});
