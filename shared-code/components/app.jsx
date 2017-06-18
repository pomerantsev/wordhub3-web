import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Helmet} from 'react-helmet';
import {translate} from 'react-i18next';

import * as helpers from '../utils/helpers';
import * as authUtils from '../utils/auth-utils';

import AuthedMenu from './authed-menu.jsx';
import UnauthedMenu from './unauthed-menu.jsx';

class App extends React.Component {

  render () {
    const {t} = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
        <div
            className="app__container">
          <Helmet>
            <title>{t('appName')}</title>
          </Helmet>
          {/* This extra div here is necessary to make the child div not affected by flex layout rules */}
          <div>
            <div
                className="app__content">
              {this.props.loggedIn ?
                <AuthedMenu
                /> :
                <UnauthedMenu
                />
              }
              {this.props.children}
            </div>
          </div>
          <div
              className="app__footer">
            <div
                className="app__footer__inner">
              <p
                  className="app__footer__copyright">
                {helpers.getCopyrightYears()},
                {' '}
                <a
                    href="https://www.facebook.com/pomerantsevp">
                  {t('footer.authorName')}
                </a>
              </p>
              <p
                  className="app__footer__email">
                <a
                    href="mailto:pomerantsevp@gmail.com">
                  pomerantsevp@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const StatefulContainer = connect(
  state => ({
    userAgent: state.get('userAgent'),
    loggedIn: authUtils.isLoggedIn(state)
  }),
  {}
)(App);

export default translate()(StatefulContainer);
