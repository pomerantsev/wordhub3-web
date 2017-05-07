import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';

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
    const completed = this.props.todayRepetitions.filter(
      repetition => repetition.get('actualDate')
    ).size;
    return {total, completed};
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    return (
      <div>
        {this.props.initialLoadingCompleted ?
          <div>
            {this.props.online ?
              null :
              <div
                  style={{color: 'red'}}>
                Offline!
              </div>
            }
            <div>
              <Link
                  to="/repetitions">
                Repeat ({repetitionCounts.completed} of {repetitionCounts.total})
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
          </div> :
          <div>
            <CircularProgress
                mode="indeterminate"
            />
          </div>
        }
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  state => ({
    todayRepetitions: getters.getTodayRepetitions(state.get('userData')),
    online: state.get('online'),
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted'])
  }),
  actionCreators
)(AuthedRoot);
