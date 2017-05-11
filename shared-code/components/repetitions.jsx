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
          {this.props.todayRepetitions.map(repetitionUuid => {
            const repetition = this.props.repetitions.get(repetitionUuid);
            const flashcard = this.props.flashcards.get(repetition.get('flashcardUuid'));
            return (
              <li
                  key={repetition.get('uuid')}>
                <span
                    style={{color: repetition.get('actualDate') ? (repetition.get('successful') ? 'green' : 'red') : 'black'}}>
                  {flashcard.get('frontText').match(/([^\n]*)(\n|$)/)[1]}
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
            );
          })}
        </ul>
      </div>
    );
  }

}

export const RepetitionsContainer = connect(
  state => ({
    todayRepetitions: getters.getTodayRepetitions(state.get('userData')),
    repetitions: state.getIn(['userData', 'repetitions']),
    flashcards: state.getIn(['userData', 'flashcards'])
  }),
  actionCreators
)(Repetitions);
