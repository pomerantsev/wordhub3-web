import i18next from 'i18next';

import React from 'react';
import {Link} from 'react-router';

export default class AuthedMenu extends React.Component {

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
        </div>
      </div>
    );
  }

}
