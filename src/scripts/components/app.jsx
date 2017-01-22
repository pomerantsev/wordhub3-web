import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as constants from '../data/constants';
import * as actionCreators from '../data/action-creators';

export class App extends React.Component {

  onChangeDate (event) {
    this.props.changeDate(event.target.value);
  }

  onChangeNewFlashcardText (event) {
    this.props.changeNewFlashcardText(event.target.value);
  }

  onCreateFlashcard (event) {
    event.preventDefault();
    this.props.createFlashcard();
  }

  onChangeFlashcardFrontText (uuid, event) {
    this.props.changeFlashcardFrontText(uuid, event.target.value);
  }

  dateDiff (date1, date2) {
    return moment(date1).diff(moment(date2), 'days');
  }

  getRepetitions () {
    const repetitions = this.props.repetitions;
    const repetitionsGroupedByPlannedDay = repetitions
      .groupBy(repetition => repetition.get('plannedDay'));
    const lastCompletedDay = repetitionsGroupedByPlannedDay
      .filter(repsForDay => repsForDay.every(rep => rep.get('actualDate')))
      .keySeq()
      .sort((key1, key2) => key1 - key2)
      .last();
    const firstDay = repetitionsGroupedByPlannedDay
      .keySeq()
      .sort((key1, key2) => key1 - key2)
      .first();
    if (typeof lastCompletedDay !== 'undefined') {
      const maxActualDate = repetitionsGroupedByPlannedDay
        .get(lastCompletedDay)
        .max((rep1, rep2) => moment(rep1.get('actualDate')).diff(moment(rep2.get('actualDate')), 'days'))
        .get('actualDate');
      if (this.props.date <= maxActualDate) {
        return repetitions.map(repetition =>
          repetition.set('today',
            repetition.get('actualDate') === maxActualDate
          )
        );
      } else {
        const firstAvailableDayAfterLastCompletedDay = repetitionsGroupedByPlannedDay
          .keySeq()
          .sort((key1, key2) => key1 - key2)
          .find(day => day > lastCompletedDay && day <= lastCompletedDay + this.dateDiff(this.props.date, maxActualDate));
        return repetitions.map(repetition =>
          repetition.set('today',
            repetition.get('plannedDay') === firstAvailableDayAfterLastCompletedDay &&
            (!repetition.get('actualDate') || repetition.get('actualDate') >= this.props.date)
          )
        );
      }
    } else if (repetitions.size) {
      return repetitions.map(repetition =>
        repetition.set('today',
          this.dateDiff(this.props.date, constants.SEED_DATE) >= firstDay &&
            repetition.get('plannedDay') === firstDay &&
            (!repetition.get('actualDate') || this.dateDiff(repetition.get('actualDate'), this.props.date) >= 0)
        )
      );
    } else {
      return repetitions;
    }
  }

  memorize (repetition) {
    this.props.memorizeRepetition(repetition.get('uuid'));
  }

  render () {
    return (
      <div>
        <h1>Wordhub</h1>

        <input
            type="date"
            value={this.props.date}
            onChange={this.onChangeDate.bind(this)}
        />

        <hr />

        <div
            style={{display: 'flex'}}>
          <div
              style={{padding: 10, width: '25vw'}}>
            <form
                onSubmit={this.onCreateFlashcard.bind(this)}>
              <input
                  style={{width: 50}}
                  value={this.props.newFlashcardText}
                  onChange={this.onChangeNewFlashcardText.bind(this)}
              />
              <button>
                Create Flashcard
              </button>
            </form>
            <ul>
              {this.props.flashcards.map(flashcard => (
                <li
                    key={flashcard.get('uuid')}>
                  {flashcard.get('uuid').substring(0, 8)}
                  &nbsp;
                  <input
                      style={{width: 50}}
                      value={flashcard.get('frontText')}
                      onChange={this.onChangeFlashcardFrontText.bind(this, flashcard.get('uuid'))}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div
              style={{padding: 10, width: '75vw'}}>
            <table
                style={{borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th>uuid</th>
                  <th>flashcard uuid</th>
                  <th>seq no</th>
                  <th>planned day</th>
                  <th>actual date</th>
                  <th>updated at</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {this.getRepetitions().map(repetition => (
                  <tr
                      key={repetition.get('uuid')}
                      style={{
                        backgroundColor: repetition.get('today') ? '#f0fff0' : 'white'
                      }}>
                    <td>{repetition.get('uuid').substring(0, 8)}</td>
                    <td>{repetition.get('flashcardUuid').substring(0, 8)}</td>
                    <td>{repetition.get('seq')}</td>
                    <td>{repetition.get('plannedDay')}</td>
                    <td>{repetition.get('actualDate')}</td>
                    <td>{repetition.get('updatedAt')}</td>
                    <td>
                      {repetition.get('today') && !repetition.get('actualDate') ?
                        <button
                            onClick={this.memorize.bind(this, repetition)}>
                          Memorize
                        </button> :
                        null
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export const AppContainer = connect(
  state => ({
    newFlashcardText: state.get('newFlashcardText'),
    flashcards: state.get('flashcards'),
    repetitions: state.get('repetitions'),
    date: state.get('date')
  }),
  actionCreators
)(App);
