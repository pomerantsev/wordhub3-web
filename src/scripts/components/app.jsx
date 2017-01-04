import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

export class App extends React.Component {
  render () {
    return (
      <h1>Hello test-client!</h1>
    );
  }
}

export const AppContainer = connect(
  () => ({}),
  actionCreators
)(App);
