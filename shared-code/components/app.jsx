import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Helmet} from 'react-helmet';

import * as helpers from '../utils/helpers';

class App extends React.Component {

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
        <div
            className="app__container">
          <Helmet>
            <title>{getI18n().t('appName')}</title>
          </Helmet>
          <div
              className="app__content">
            {this.props.children}
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
                  {getI18n().t('footer.authorName')}
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
    userAgent: state.get('userAgent')
  }),
  {}
)(App);
