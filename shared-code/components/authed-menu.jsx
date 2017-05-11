import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';

class AuthedMenu extends React.Component {

  constructor () {
    super();
    this.logout = this.logout.bind(this);
    this.getTodayRepetitionCounts = this.getTodayRepetitionCounts.bind(this);
  }

  logout (event) {
    event.preventDefault();
    this.props.logout();
  }

  getTodayRepetitionCounts () {
    const total = this.props.todayRepetitions.size;
    const completed = this.props.todayRepetitions.filter(
      repetitionUuid => this.props.repetitions.getIn([repetitionUuid, 'actualDate'])
    ).size;
    return {total, completed};
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    return (
      <div
          className="authed-menu">
        {this.props.online ?
          null :
          <div
              style={{color: 'red'}}>
            {getI18n().t('notifications.offline')}
          </div>
        }
        <div>
          <Link
              className="authed-menu__primary-link"
              to="/flashcards/new">
            {getI18n().t('menu.create')}
          </Link>
          <Link
              className="authed-menu__primary-link"
              to="/repetitions">
            <div>
              {getI18n().t('menu.repeat')}
            </div>
            <div>
              {getI18n().t('menu.completedOfTotal', {
                completed: repetitionCounts.completed,
                total: repetitionCounts.total
              })}
            </div>
          </Link>
          <Link
              to="/flashcards">
            {getI18n().t('menu.allFlashcards')}
          </Link>
          <Link
              to="/stats">
            {getI18n().t('menu.stats')}
          </Link>
          <a
              onClick={this.logout}>
            {getI18n().t('menu.logout')}
          </a>
        </div>
      </div>
    );
  }

}

export const AuthedMenuContainer = connect(
  state => ({
    todayRepetitions: state.getIn(['userData', 'repetitionsForToday']),
    repetitions: state.getIn(['userData', 'repetitions']),
    online: state.get('online')
  }),
  actionCreators
)(AuthedMenu);
