import i18next from 'i18next';

import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

export default class AuthedMenu extends React.Component {

  constructor () {
    super();

    this.state = {
      dropdownMenuOpen: false
    };

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
    return (
      <div
          className="unauthed-menu">
        <div
            className="unauthed-menu__main">
          <Link
              to="/"
              className="unauthed-menu__brand">
            {i18next.t('appName')}
          </Link>
          <button
              ref={this.toggleRef}
              className="unauthed-menu__toggle">
            <div>
              <span
                  className="unauthed-menu__toggle__icon-bar"
              />
              <span
                  className="unauthed-menu__toggle__icon-bar"
              />
              <span
                  className="unauthed-menu__toggle__icon-bar"
              />
            </div>
          </button>
        </div>
        <div
            className={classNames(
              this.state.dropdownMenuOpen ? 'unauthed-menu__collapsing-menu--open' : 'unauthed-menu__collapsing-menu--collapsed'
            )}>
          <ul
              className="unauthed-menu__secondary-menu">
            <li>
              <Link
                  activeClassName="unauthed-menu__menu-item--active"
                  to="/intro">
                {i18next.t('menu.about')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
