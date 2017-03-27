import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';

class AuthedRoot extends React.Component {

  logout (event) {
    event.preventDefault();
    this.props.logout();
  }

  render () {
    return (
      <div>
        <div>
          <Link
              to="/flashcards">
            All Flashcards
          </Link>
          <br />
          <Link
              to="/flashcards/new">
            Create
          </Link>
          <br />
          <a
              onClick={this.logout.bind(this)}>
            Logout
          </a>
        </div>
        {this.props.children}
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  () => ({}),
  actionCreators
)(AuthedRoot);
