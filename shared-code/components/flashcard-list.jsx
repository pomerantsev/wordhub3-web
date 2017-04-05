import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';

class FlashcardList extends React.Component {

  render () {
    return (
      <div>
        <ul>
          {this.props.flashcards.map(flashcard => {
            return (
              <li
                  key={flashcard.get('uuid')}>
                <Link
                    to={`/flashcards/${flashcard.get('uuid')}`}>
                  <span>{flashcard.get('uuid')}</span>
                  <span>&nbsp;</span>
                  <span>{flashcard.get('frontText').match(/([^\n]*)(\n|$)/)[1]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}

export const FlashcardListContainer = connect(
  state => ({
    flashcards: state.getIn(['userData', 'flashcards'])
  }),
  actionCreators
)(FlashcardList);
