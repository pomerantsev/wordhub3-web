import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import moment from 'moment';
import * as helpers from '../utils/helpers';

import * as actionCreators from '../data/action-creators';

import Paginator from './paginator.jsx';

const FLASHCARDS_PER_PAGE = 25;

class FlashcardList extends React.Component {

  constructor () {
    super();
    this.getDisplayedFlashcards = this.getDisplayedFlashcards.bind(this);
  }

  getDisplayedFlashcards () {
    return this.props.flashcards
      .skip((parseInt(this.props.location.query.page) - 1) * FLASHCARDS_PER_PAGE)
      .take(FLASHCARDS_PER_PAGE)
      .map(flashcard => flashcard.set('date', moment(flashcard.get('createdAt')).format('D MMM YYYY')));
  }

  render () {
    const displayedFlashcards = this.getDisplayedFlashcards();
    return (
      <div>
        <ul>
          {displayedFlashcards.map((flashcard, index) => {
            return (
              <div
                  key={flashcard.get('uuid')}>
                {index === 0 || flashcard.get('date') !== displayedFlashcards.getIn([index - 1, 'date']) ?
                  <p>{flashcard.get('date')}</p> :
                  null
                }
                <li>
                  <Link
                      to={`/flashcards/${flashcard.get('uuid')}`}>
                    <span>{flashcard.get('uuid')}</span>
                    <span>&nbsp;</span>
                    <span>{flashcard.get('frontText').match(/([^\n]*)(\n|$)/)[1]}</span>
                  </Link>
                </li>
              </div>
            );
          })}
        </ul>
        <Paginator
            itemCount={this.props.flashcards.size}
            itemsPerPage={FLASHCARDS_PER_PAGE}
            location={this.props.location}
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
