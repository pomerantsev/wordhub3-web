import i18next from 'i18next';

import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Helmet} from 'react-helmet';

import * as helpers from '../utils/helpers';
import * as authUtils from '../utils/auth-utils';

import {AuthedMenuContainer} from './authed-menu.jsx';
import UnauthedMenu from './unauthed-menu.jsx';

class App extends React.Component {

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
        <div
            className="app__container">
          <Helmet>
            <title>{i18next.t('appName')}</title>
          </Helmet>
        {/* This extra div here is necessary to make the child div not affected by flex layout rules */}
          <div>
            <div
                className="app__content">
              {this.props.loggedIn ?
                <AuthedMenuContainer
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
                  {i18next.t('footer.authorName')}
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

export const AppContainer = connect(
  state => ({
    userAgent: state.get('userAgent'),
    loggedIn: authUtils.isLoggedIn(state)
  }),
  {}
)(App);
