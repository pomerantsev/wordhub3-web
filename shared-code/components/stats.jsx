import i18next from 'i18next';

import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Helmet} from 'react-helmet';

import * as getters from '../data/getters';
import * as helpers from '../utils/helpers';

import StatsItem from './stats-item.jsx';

class Stats extends React.Component {

  render () {
    return (
      <div>
        <Helmet>
          <title>{i18next.t('stats.title')}</title>
        </Helmet>
        <h2>{i18next.t('stats.heading')}</h2>
        <div
            className="stats__container">
          <div
              className="stats__column">
            <h3>{i18next.t('stats.general')}</h3>
            <table
                className="stats__column__table">
              <tbody>
                <StatsItem
                    title={i18next.t('stats.flashcardsCreated')}
                    value={this.props.flashcards.size}
                />
                <StatsItem
                    title={i18next.t('stats.flashcardsLearned')}
                    value={this.props.learnedFlashcards.size}
                />
                <StatsItem
                    title={i18next.t('stats.totalRepetitionsPlanned')}
                    value={this.props.plannedRepetitions.size}
                />
                <StatsItem
                    title={i18next.t('stats.upcomingRepetitions')}
                    value={this.props.nextDayData ?
                      `${this.props.nextDayData.get('repetitions').size} (${moment(this.props.nextDayData.get('date')).format('D MMM YYYY')})` :
                      i18next.t('stats.none')
                    }
                />
                <StatsItem
                    title={i18next.t('stats.repetitionsPlannedUntil')}
                    value={this.props.lastDayData ?
                      `${moment(this.props.lastDayData.get('date')).format('D MMM YYYY')}` :
                      i18next.t('stats.none')
                    }
                />
              </tbody>
            </table>
          </div>

          <div
              className="stats__column">
            <h3>{i18next.t('stats.last30Days')}</h3>
            <table
                className="stats__column__table">
              <tbody>
                <StatsItem
                    title={i18next.t('stats.flashcardsCreated')}
                    value={this.props.monthStats.get('flashcardsCreated').size}
                />
                <StatsItem
                    title={i18next.t('stats.flashcardsLearned')}
                    value={this.props.monthStats.get('flashcardsLearnedCount')}
                />
                <StatsItem
                    title={i18next.t('stats.totalRepetitions')}
                    value={this.props.monthStats.get('allRepetitions').size}
                />
                <StatsItem
                    title={i18next.t('stats.successfulRepetitions')}
                    value={`${this.props.monthStats.get('successfulRepetitions').size} (${helpers.getRoundedPercentageString(this.props.monthStats.get('successfulRepetitions').size / this.props.monthStats.get('allRepetitions').size)})`}
                />
              </tbody>
            </table>
          </div>

          <div
              className="stats__column">
            <h3>{i18next.t('stats.today')}</h3>
            <table
                className="stats__column__table">
              <tbody>
                <StatsItem
                    title={i18next.t('stats.flashcardsCreated')}
                    value={this.props.dayStats.get('flashcardsCreated').size}
                />
                <StatsItem
                    title={i18next.t('stats.flashcardsLearned')}
                    value={this.props.dayStats.get('flashcardsLearnedCount')}
                />
                <StatsItem
                    title={i18next.t('stats.totalRepetitions')}
                    value={this.props.dayStats.get('allRepetitions').size}
                />
                <StatsItem
                    title={i18next.t('stats.successfulRepetitions')}
                    value={`${this.props.dayStats.get('successfulRepetitions').size} (${helpers.getRoundedPercentageString(this.props.dayStats.get('successfulRepetitions').size / this.props.dayStats.get('allRepetitions').size)})`}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}

export const StatsContainer = connect(
  state => ({
    flashcards: getters.getFlashcards(state.get('userData')),
    learnedFlashcards: getters.getLearnedFlashcards(state.get('userData')),
    plannedRepetitions: getters.getPlannedRepetitions(state.get('userData')),
    nextDayData: getters.getNextDayData(state.get('userData')),
    lastDayData: getters.getLastDayData(state.get('userData')),
    monthStats: getters.getIntervalStats(30)(state.get('userData')),
    dayStats: getters.getIntervalStats(1)(state.get('userData'))
  }),
  {}
)(Stats);
