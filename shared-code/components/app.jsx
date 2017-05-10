import React from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends React.Component {

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: this.props.userAgent})}>
        <div
            className="app__container">
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
