import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as helpers from '../utils/helpers';

import * as actionCreators from '../data/action-creators';

import Paginator from './paginator.jsx';

const FLASHCARDS_PER_PAGE = 25;

class FlashcardList extends React.Component {

  render () {
    const location = this.props.location;
    return (
      <div>
        <ul>
          {this.props.flashcards.skip((parseInt(location.query.page) - 1) * FLASHCARDS_PER_PAGE).take(FLASHCARDS_PER_PAGE).map(flashcard => {
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
        <Paginator
            itemCount={this.props.flashcards.size}
            itemsPerPage={FLASHCARDS_PER_PAGE}
            location={location}
        />
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
