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
    this.onCurrentDateChange = this.onCurrentDateChange.bind(this);
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

  onCurrentDateChange (event) {
    this.props.currentDateChange(event.target.value);
  }

  render () {
    const repetitionCounts = this.getTodayRepetitionCounts();
    return (
      <div>
        <input
            type="date"
            value={this.props.currentDate}
            onChange={this.onCurrentDateChange}
        />
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
        <table>
          <tbody>
            {this.props.repetitionsIndexedByPlannedDay.map((repetitionsByDay, plannedDay) => (
              <tr
                  key={plannedDay}>
                <td>{plannedDay}</td>
                <td>{repetitionsByDay.get('completed') ? 'true' : 'false'}</td>
                <td>{repetitionsByDay.get('repetitions').size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  state => ({
    todayRepetitions: getters.getTodayRepetitions(state.get('userData')),
    currentDate: state.getIn(['userData', 'currentDate']),
    repetitionsIndexedByPlannedDay: state.getIn(['userData', 'repetitionsIndexedByPlannedDay']).reverse()
  }),
  actionCreators
)(AuthedRoot);
