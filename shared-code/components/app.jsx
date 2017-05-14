import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Helmet} from 'react-helmet';

class App extends React.Component {

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
        <div
            className="app__container">
          <Helmet>
            <title>{getI18n().t('appName')}</title>
          </Helmet>
          {this.props.children}
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
