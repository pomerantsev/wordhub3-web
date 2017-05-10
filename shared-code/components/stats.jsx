import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as getters from '../data/getters';
import * as helpers from '../utils/helpers';

class Stats extends React.Component {

  render () {
    return (
      <div>
        <h1>{getI18n().t('stats.general')}</h1>
        <p>{getI18n().t('stats.flashcardsCreated')}: {this.props.flashcards.size}</p>
        <p>{getI18n().t('stats.flashcardsLearned')}: {this.props.learnedFlashcards.size}</p>
        <p>{getI18n().t('stats.totalRepetitionsPlanned')}: {this.props.plannedRepetitions.size}</p>
        <p>
          {getI18n().t('stats.upcomingRepetitions')}:
          {' '}
          {this.props.nextDayData ?
            `${this.props.nextDayData.get('repetitions').size} (${moment(this.props.nextDayData.get('date')).format('D MMM YYYY')})` :
            getI18n().t('stats.none')
          }
        </p>
        <p>
          {getI18n().t('stats.repetitionsPlannedUntil')}:
          {' '}
          {this.props.lastDayData ?
            `${moment(this.props.lastDayData.get('date')).format('D MMM YYYY')}` :
            getI18n().t('stats.none')
          }
        </p>
        <h1>{getI18n().t('stats.last30Days')}</h1>
        <p>{getI18n().t('stats.flashcardsCreated')}: {this.props.monthStats.get('flashcardsCreated').size}</p>
        <p>{getI18n().t('stats.flashcardsLearned')}: {this.props.monthStats.get('flashcardsLearnedCount')}</p>
        <p>{getI18n().t('stats.totalRepetitions')}: {this.props.monthStats.get('allRepetitions').size}</p>
        <p>
          {getI18n().t('stats.successfulRepetitions')}: {this.props.monthStats.get('successfulRepetitions').size}
          {' '}
          ({helpers.getRoundedPercentageString(this.props.monthStats.get('successfulRepetitions').size / this.props.monthStats.get('allRepetitions').size)})
        </p>
        <h1>{getI18n().t('stats.today')}</h1>
        <p>{getI18n().t('stats.flashcardsCreated')}: {this.props.dayStats.get('flashcardsCreated').size}</p>
        <p>{getI18n().t('stats.flashcardsLearned')}: {this.props.dayStats.get('flashcardsLearnedCount')}</p>
        <p>{getI18n().t('stats.totalRepetitions')}: {this.props.dayStats.get('allRepetitions').size}</p>
        <p>
          {getI18n().t('stats.successfulRepetitions')}: {this.props.dayStats.get('successfulRepetitions').size}
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
