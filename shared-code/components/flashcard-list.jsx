import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as helpers from '../utils/helpers';

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

const getFlashcardsSorted = helpers.createDeepEqualSelector(
  [state => state.getIn(['userData', 'flashcards'])],
  flashcards => flashcards
    .sort((flashcard1, flashcard2) => flashcard2.get('createdAt') - flashcard1.get('createdAt'))
);

export const FlashcardListContainer = connect(
  state => ({
    flashcards: getFlashcardsSorted(state)
  }),
  actionCreators
)(FlashcardList);
