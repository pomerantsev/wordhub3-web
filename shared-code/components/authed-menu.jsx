import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import classNames from 'classnames';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class AuthedMenu extends React.Component {

  constructor () {
    super();

    this.state = {
      dropdownMenuOpen: false
    };

    this.logout = this.logout.bind(this);
    this.getTodayRepetitionCounts = this.getTodayRepetitionCounts.bind(this);
    this.onDropdownToggleClick = this.onDropdownToggleClick.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
    this.toggleRef = this.toggleRef.bind(this);
  }

  componentDidMount () {
    this.toggleElement.addEventListener('click', this.onDropdownToggleClick);
    document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount () {
    this.toggleElement.removeEventListener('click', this.onDropdownToggleClick);
    document.body.removeEventListener('click', this.onBodyClick);
  }

  toggleRef (element) {
    this.toggleElement = element;
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

  onDropdownToggleClick (event) {
    event.stopPropagation();
    this.setState({
      dropdownMenuOpen: !this.state.dropdownMenuOpen
    });
  }

  onBodyClick () {
    this.setState({
      dropdownMenuOpen: false
    });
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    const todayFlashcardsCount = this.props.todayFlashcards.size;
    const dailyLimit = this.props.userSettings.get('dailyLimit');
    return (
      <div
          className="authed-menu">
        <div
            className="authed-menu__main">
          <Link
              className={classNames({
                'authed-menu__primary-link': true,
                'authed-menu__primary-link--to-do': todayFlashcardsCount < dailyLimit
              })}
              to="/flashcards/new">
            <div>
              {getI18n().t('menu.create')}
            </div>
            <div
                className="authed-menu__primary-link__small">
              {getI18n().t('menu.completedOfTotal', {
                completed: todayFlashcardsCount,
                total: dailyLimit
              })}
            </div>
          </Link>
          <Link
              className={classNames({
                'authed-menu__primary-link': true,
                'authed-menu__primary-link--to-do': repetitionCounts.completed < repetitionCounts.total,
                'authed-menu__primary-link--muted': repetitionCounts.completed === repetitionCounts.total
              })}
              activeClassName="authed-menu__primary-link--active"
              to="/repetitions">
            <div>
              {getI18n().t('menu.repeat')}
            </div>
            <div
                className="authed-menu__primary-link__small">
              {getI18n().t('menu.completedOfTotal', {
                completed: repetitionCounts.completed,
                total: repetitionCounts.total
              })}
            </div>
          </Link>
          {this.props.online ?
            null :
            <span
                className="authed-menu__primary-link"
                style={{color: 'red'}}>
              {getI18n().t('notifications.offline')}
            </span>
          }
          <button
              ref={this.toggleRef}
              className="authed-menu__toggle">
            <div>
              <span
                  className="authed-menu__toggle__icon-bar"
              />
              <span
                  className="authed-menu__toggle__icon-bar"
              />
              <span
                  className="authed-menu__toggle__icon-bar"
              />
            </div>
          </button>
        </div>
        <div
            className={classNames(
              this.state.dropdownMenuOpen ? 'authed-menu__collapsing-menu--open' : 'authed-menu__collapsing-menu--collapsed'
            )}>
          <ul
              className="authed-menu__secondary">
            <li>
              <Link
                  className="authed-menu__secondary-menu-item"
                  activeClassName="authed-menu__menu-item--active"
                  to="/flashcards">
                {getI18n().t('menu.allFlashcards')}
              </Link>
            </li>
            <li>
              <Link
                  className="authed-menu__secondary-menu-item"
                  activeClassName="authed-menu__menu-item--active"
                  to="/stats">
                {getI18n().t('menu.stats')}
              </Link>
            </li>
            <li>
              <a
                  className="authed-menu__secondary-menu-item"
                  onClick={this.logout}>
                {getI18n().t('menu.logout')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}

export const AuthedMenuContainer = connect(
  state => ({
    todayFlashcards: getters.getTodayFlashcards(state.get('userData')),
    todayRepetitions: state.getIn(['userData', 'repetitionsForToday']),
    repetitions: state.getIn(['userData', 'repetitions']),
    userSettings: state.getIn(['userData', 'userSettings']),
    online: state.get('online')
  }),
  actionCreators
)(AuthedMenu);
