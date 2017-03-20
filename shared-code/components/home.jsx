import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class Home extends React.Component {

  render () {
    return (
      <div>
        Hello, I’m not logged in
      </div>
    );
  }

}

export const HomeContainer = connect(
  state => ({
    user: state.get('user')
  }),
  actionCreators
)(Home);
