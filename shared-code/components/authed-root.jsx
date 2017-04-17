import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class AuthedRoot extends React.Component {

  constructor () {
    super();
    this.logout = this.logout.bind(this);
    this.getTodayRepetitionCounts = this.getTodayRepetitionCounts.bind(this);
  }

  logout (event) {
    event.preventDefault();
    this.props.logout();
  }

  getTodayRepetitionCounts () {
    const total = this.props.todayRepetitions.size;
    const remaining = this.props.todayRepetitions.filter(
      repetition => !repetition.get('actualDate')
    ).size;
    return {total, remaining};
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    return (
      <div>
        <div>
          <Link
              to="/repetitions">
            Repeat ({repetitionCounts.remaining} of {repetitionCounts.total})
          </Link>
          <br />
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
              onClick={this.logout}>
            Logout
          </a>
        </div>
        {this.props.children}
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  state => ({
    todayRepetitions: getters.getTodayRepetitions(state)
  }),
  actionCreators
)(AuthedRoot);
