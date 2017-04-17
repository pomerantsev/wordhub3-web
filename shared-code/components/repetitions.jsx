import React from 'react';
import {connect} from 'react-redux';

import * as getters from '../data/getters';
import * as actionCreators from '../data/action-creators';

class Repetitions extends React.Component {

  constructor () {
    super();
  }

  render () {
    return (
      <div>
        <ul>
          {this.props.repetitions.map(repetition => (
            <li
                key={repetition.get('uuid')}>
              {repetition.getIn(['flashcard', 'frontText']).match(/([^\n]*)(\n|$)/)[1]}
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
