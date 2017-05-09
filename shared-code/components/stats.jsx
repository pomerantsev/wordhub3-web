import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as getters from '../data/getters';
import * as helpers from '../utils/helpers';

class Stats extends React.Component {

  render () {
    return (
      <div>
        <h1>General</h1>
        <p>Total flashcards: {this.props.flashcards.size}</p>
        <p>Learned flashcards: {this.props.learnedFlashcards.size}</p>
        <p>Total repetitions planned: {this.props.plannedRepetitions.size}</p>
        <p>
          Upcoming repetitions:
          {' '}
          {this.props.nextDayData ?
            `${this.props.nextDayData.get('repetitions').size} (${moment(this.props.nextDayData.get('date')).format('D MMM YYYY')})` :
            'none'
          }
        </p>
        <p>
          Repetitions planned until:
          {' '}
          {this.props.lastDayData ?
            `${moment(this.props.lastDayData.get('date')).format('D MMM YYYY')}` :
            'none'
          }
        </p>
        <h1>Last 30 days</h1>
        <p>Flashcards created: {this.props.monthStats.get('flashcardsCreated').size}</p>
        <p>Flashcards learned: {this.props.monthStats.get('flashcardsLearnedCount')}</p>
        <p>Total repetitions: {this.props.monthStats.get('allRepetitions').size}</p>
        <p>
          Successful repetitions: {this.props.monthStats.get('successfulRepetitions').size}
          {' '}
          ({helpers.getRoundedPercentageString(this.props.monthStats.get('successfulRepetitions').size / this.props.monthStats.get('allRepetitions').size)})
        </p>
        <h1>Today</h1>
        <p>Flashcards created: {this.props.dayStats.get('flashcardsCreated').size}</p>
        <p>Flashcards learned: {this.props.dayStats.get('flashcardsLearnedCount')}</p>
        <p>Total repetitions: {this.props.dayStats.get('allRepetitions').size}</p>
        <p>
          Successful repetitions: {this.props.dayStats.get('successfulRepetitions').size}
          {' '}
          ({helpers.getRoundedPercentageString(this.props.dayStats.get('successfulRepetitions').size / this.props.dayStats.get('allRepetitions').size)})
        </p>
      </div>
    );
  }

}

export const StatsContainer = connect(
  state => ({
    flashcards: state.getIn(['userData', 'flashcards']),
    learnedFlashcards: getters.getLearnedFlashcards(state.get('userData')),
    plannedRepetitions: getters.getPlannedRepetitions(state.get('userData')),
    nextDayData: getters.getNextDayData(state.get('userData')),
    lastDayData: getters.getLastDayData(state.get('userData')),
    monthStats: getters.getIntervalStats(30)(state.get('userData')),
    dayStats: getters.getIntervalStats(1)(state.get('userData'))
  }),
  {}
)(Stats);
