import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as getters from '../data/getters';

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
    lastDayData: getters.getLastDayData(state.get('userData'))
  }),
  {}
)(Stats);
