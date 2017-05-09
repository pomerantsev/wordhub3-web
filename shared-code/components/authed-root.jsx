import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class AuthedRoot extends React.Component {

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
      repetition => repetition.get('actualDate')
    ).size;
    return {total, completed};
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    return (
      <div>
        {this.props.initialLoadingCompleted ?
          <div>
            {this.props.online ?
              null :
              <div
                  style={{color: 'red'}}>
                {getI18n().t('notifications.offline')}
              </div>
            }
            <div>
              <Link
                  to="/stats">
                {getI18n().t('menu.stats')}
              </Link>
              <br />
              <Link
                  to="/repetitions">
                {getI18n().t('menu.repeat', {
                  completed: repetitionCounts.completed,
                  total: repetitionCounts.total
                })}
              </Link>
              <br />
              <Link
                  to="/flashcards">
                {getI18n().t('menu.allFlashcards')}
              </Link>
              <br />
              <Link
                  to="/flashcards/new">
                {getI18n().t('menu.create')}
              </Link>
              <br />
              <a
                  onClick={this.logout}>
                {getI18n().t('menu.logout')}
              </a>
            </div>
            {this.props.children}
          </div> :
          <div>
            <CircularProgress
                mode="indeterminate"
            />
          </div>
        }
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  state => ({
    todayRepetitions: getters.getTodayRepetitions(state.get('userData')),
    online: state.get('online'),
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted'])
  }),
  actionCreators
)(AuthedRoot);
