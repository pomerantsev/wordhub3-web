import {getI18n} from '../locales/i18n';

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
            {getI18n().t('appName')}
          </Link>
        </div>
      </div>
    );
  }

}
