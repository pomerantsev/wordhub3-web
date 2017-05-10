import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';

import * as getters from '../data/getters';
import * as actionCreators from '../data/action-creators';

class Repetitions extends React.Component {

  constructor () {
    super();
  }

  runRepetition (repetition, successful) {
    this.startTime = Date.now();
    this.props.runRepetition(repetition.get('uuid'), successful);
  }

  render () {
    if (this.startTime) {
      console.log('Updating repetitions took ' + (Date.now() - this.startTime) + ' ms');
      this.startTime = null;
    }
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
                    {getI18n().t('repetitions.remember')}
                  </button>
                  &nbsp;
                  <button
                      onClick={this.runRepetition.bind(this, repetition, false)}>
                    {getI18n().t('repetitions.dontRemember')}
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
    repetitions: getters.getTodayRepetitions(state.get('userData'))
  }),
  actionCreators
)(Repetitions);
