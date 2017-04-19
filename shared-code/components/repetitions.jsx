import React from 'react';
import {connect} from 'react-redux';

import * as getters from '../data/getters';
import * as actionCreators from '../data/action-creators';

class Repetitions extends React.Component {

  constructor () {
    super();
  }

  runRepetition (repetition, successful) {
    this.props.runRepetition(repetition.get('uuid'), successful);
  }

  render () {
    console.log(this.props.repetitions.toJS());
    return (
      <div>
        <ul>
          {this.props.repetitions.map(repetition => (
            <li
                key={repetition.get('uuid')}>
              <span
                  style={{color: repetition.get('actualDate') ? (repetition.get('successful') ? 'green' : 'red') : 'black'}}>
                {repetition.getIn(['flashcard', 'frontText']).match(/([^\n]*)(\n|$)/)[1]}
              </span>
              {repetition.get('actualDate') ?
                null :
                <span>
                  &nbsp;
                  <button
                      onClick={this.runRepetition.bind(this, repetition, true)}>
                    Remember
                  </button>
                  &nbsp;
                  <button
                      onClick={this.runRepetition.bind(this, repetition, false)}>
                    Don’t remember
                  </button>
                </span>
              }
            </li>
          ))}
        </ul>
      </div>
    );
  }

}

export const RepetitionsContainer = connect(
  state => ({
    repetitions: getters.getTodayRepetitions(state)
  }),
  actionCreators
)(Repetitions);
