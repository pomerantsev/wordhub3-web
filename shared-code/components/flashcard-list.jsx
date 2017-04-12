import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import moment from 'moment';
import escapeStringRegexp from 'escape-string-regexp';
import * as helpers from '../utils/helpers';

import * as actionCreators from '../data/action-creators';

import Paginator from './paginator.jsx';

const FLASHCARDS_PER_PAGE = 25;

class FlashcardList extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor () {
    super();
    this.getDisplayedFlashcards = this.getDisplayedFlashcards.bind(this);
    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.onClearSearchClick = this.onClearSearchClick.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const nextPage = parseInt(nextProps.location.query.page) || 1;
    const nextTotalPages = Math.ceil(nextProps.flashcards.size / FLASHCARDS_PER_PAGE);
    if (nextPage > 1 && nextPage > nextTotalPages || nextPage < 1) {
      this.context.router.replace(helpers.getPaginatedLink(nextProps.location.pathname, nextTotalPages || 1));
    }
  }

  onSearchStringChange (event) {
    this.props.searchStringChange(event.target.value);
  }

  onClearSearchClick (event) {
    event.preventDefault();
    this.props.searchStringChange('');
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
        <div>
          <input
              type="text"
              value={this.props.searchString}
              onChange={this.onSearchStringChange}
          />
        </div>
        {this.props.searchString ?
          <div>
            Searching for “{this.props.searchString}”
            (<a
                href
                onClick={this.onClearSearchClick}>
              clear
            </a>)
          </div> :
          null
        }
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
  [
    state => state.getIn(['userData', 'flashcards']),
    state => state.getIn(['userData', 'searchString'])
  ],
  (flashcards, searchString) => {
    const searchStringRegExp = new RegExp(escapeStringRegexp(searchString));
    return flashcards
      .filter(flashcard => searchString ?
        searchStringRegExp.test(flashcard.get('frontText')) ||
          searchStringRegExp.test(flashcard.get('backText')) :
        true
      )
      .sort((flashcard1, flashcard2) => flashcard2.get('createdAt') - flashcard1.get('createdAt'));
  }
);

export const FlashcardListContainer = connect(
  state => ({
    flashcards: getFlashcardsSorted(state),
    searchString: state.getIn(['userData', 'searchString'])
  }),
  actionCreators
)(FlashcardList);
