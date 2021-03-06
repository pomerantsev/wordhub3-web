import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import classNames from 'classnames';
import {translate} from 'react-i18next';

import MenuNotification from './menu-notification.jsx';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class AuthedMenu extends React.Component {

  constructor () {
    super();

    this.state = {
      narrowDropdownMenuOpen: false,
      wideDropdownMenuOpen: false
    };

    this.logout = this.logout.bind(this);
    this.getTodayRepetitionCounts = this.getTodayRepetitionCounts.bind(this);
    this.onNarrowDropdownToggleClick = this.onNarrowDropdownToggleClick.bind(this);
    this.onWideDropdownToggleClick = this.onWideDropdownToggleClick.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
    this.narrowToggleRef = this.narrowToggleRef.bind(this);
    this.wideToggleRef = this.wideToggleRef.bind(this);
  }

  componentDidMount () {
    this.narrowToggleElement.addEventListener('click', this.onNarrowDropdownToggleClick);
    this.wideToggleElement.addEventListener('click', this.onWideDropdownToggleClick);
    document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount () {
    this.narrowToggleElement.removeEventListener('click', this.onNarrowDropdownToggleClick);
    this.wideToggleElement.removeEventListener('click', this.onWideDropdownToggleClick);
    document.body.removeEventListener('click', this.onBodyClick);
  }

  narrowToggleRef (element) {
    this.narrowToggleElement = element;
  }

  wideToggleRef (element) {
    this.wideToggleElement = element;
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

  onNarrowDropdownToggleClick (event) {
    event.stopPropagation();
    this.setState({
      narrowDropdownMenuOpen: !this.state.narrowDropdownMenuOpen
    });
  }

  onWideDropdownToggleClick (event) {
    event.stopPropagation();
    this.setState({
      wideDropdownMenuOpen: !this.state.wideDropdownMenuOpen
    });
  }

  onBodyClick () {
    this.setState({
      narrowDropdownMenuOpen: false,
      wideDropdownMenuOpen: false
    });
  }

  render () {
    const {t} = this.props;
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
              activeClassName="authed-menu__primary-link--active"
              to="/flashcards/new">
            <div>
              {t('menu.create')}
            </div>
            {this.props.initialLoadingCompleted ?
              <div
                  className="authed-menu__primary-link__small">
                {t('menu.completedOfTotal', {
                  completed: todayFlashcardsCount,
                  total: dailyLimit
                })}
              </div> :
              null
            }
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
              {t('menu.repeat')}
            </div>
            {this.props.initialLoadingCompleted ?
              <div
                  className="authed-menu__primary-link__small">
                {t('menu.completedOfTotal', {
                  completed: repetitionCounts.completed,
                  total: repetitionCounts.total
                })}
              </div> :
              null
            }
          </Link>
          {this.props.online ?
            null :
            this.props.indexedDB ?
              <MenuNotification
                  type="warning"
                  title={t('notifications.offlineDataSafe')}
                  hint={t('notifications.offlineDataSafeHint')}
              /> :
              <MenuNotification
                  type="danger"
                  title={t('notifications.offline')}
                  hint={t('notifications.offlineHint')}
              />
          }
          <button
              ref={this.narrowToggleRef}
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
              this.state.narrowDropdownMenuOpen ? 'authed-menu__collapsing-menu--open' : 'authed-menu__collapsing-menu--collapsed'
            )}>
          <div
              className="authed-menu__secondary--narrow">
            <ul
                className="authed-menu__secondary-menu">
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/flashcards">
                  {t('menu.allFlashcards')}
                </Link>
              </li>
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/intro">
                  {t('menu.about')}
                </Link>
              </li>
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/stats">
                  {t('menu.stats')}
                </Link>
              </li>
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/settings">
                  {t('menu.settings')}
                </Link>
              </li>
              <li>
                <a
                    className="authed-menu__secondary-menu-item"
                    onClick={this.logout}>
                  {t('menu.logout')}
                </a>
              </li>
            </ul>
          </div>
          <div
              className="authed-menu__secondary--wide">
            <ul
                className="authed-menu__secondary-menu">
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/flashcards">
                  {t('menu.allFlashcards')}
                </Link>
              </li>
              <li>
                <Link
                    className="authed-menu__secondary-menu-item"
                    activeClassName="authed-menu__menu-item--active"
                    to="/intro">
                  {t('menu.about')}
                </Link>
              </li>
              <li
                  className={classNames(
                    this.state.wideDropdownMenuOpen ? 'authed-menu__dropdown--open' : 'authed-menu__dropdown--collapsed'
                  )}>
                <a
                    ref={this.wideToggleRef}
                    className="authed-menu__dropdown-toggle authed-menu__secondary-menu-item">
                  {this.props.userSettings.get('name')}
                  {' '}
                  <b
                      className="authed-menu__dropdown-toggle__caret"
                  />
                </a>
                <ul
                    className="authed-menu__dropdown-menu">
                  <li>
                    <Link
                        className="authed-menu__secondary-menu-dropdown-item"
                        activeClassName="authed-menu__menu-dropdown-item--active"
                        to="/stats">
                      {t('menu.stats')}
                    </Link>
                  </li>
                  <li>
                    <Link
                        className="authed-menu__secondary-menu-dropdown-item"
                        activeClassName="authed-menu__menu-dropdown-item--active"
                        to="/settings">
                      {t('menu.settings')}
                    </Link>
                  </li>
                  <li
                      className="authed-menu__divider"
                  />
                  <li>
                    <a
                        className="authed-menu__secondary-menu-dropdown-item"
                        onClick={this.logout}>
                      {t('menu.logout')}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

}

const AuthedMenuContainer = connect(
  state => ({
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted']),
    todayFlashcards: getters.getTodayFlashcards(state.get('userData')),
    todayRepetitions: getters.getRepetitionsForToday(state.get('userData')),
    repetitions: getters.getRepetitions(state.get('userData')),
    userSettings: state.getIn(['userData', 'userSettings']),
    online: state.get('online'),
    indexedDB: state.get('indexedDB')
  }),
  actionCreators
)(AuthedMenu);

export default translate()(AuthedMenuContainer);
