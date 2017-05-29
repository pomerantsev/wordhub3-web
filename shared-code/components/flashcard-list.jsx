import {getI18n} from '../locales/i18n';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Helmet} from 'react-helmet';
import moment from 'moment';
import * as helpers from '../utils/helpers';
import * as getters from '../data/getters';
import * as actionCreators from '../data/action-creators';

import Paginator from './paginator.jsx';

const FLASHCARDS_PER_PAGE = 25;

class FlashcardList extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor () {
    super();
    this.getDisplayedFlashcards = this.getDisplayedFlashcards.bind(this);
    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.onClearSearchClick = this.onClearSearchClick.bind(this);

    this.searchStringRef = this.searchStringRef.bind(this);
  }

  componentWillMount () {
    this.ensureExistingPage(this.props);
  }

  componentDidMount () {
    this.searchStringElement.focus();
  }

  componentWillReceiveProps (nextProps) {
    this.ensureExistingPage(nextProps);
  }

  searchStringRef (element) {
    this.searchStringElement = element;
  }

  ensureExistingPage (props) {
    const page = parseInt(props.location.query.page) || 1;
    const totalPages = Math.ceil(props.flashcards.size / FLASHCARDS_PER_PAGE);
    if (page > 1 && page > totalPages || page < 1) {
      this.context.router.replace(helpers.getPaginatedLink(props.location.pathname, totalPages || 1));
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
      .map(flashcard => flashcard.set('date', moment(flashcard.get('creationDate')).format('D MMM YYYY')));
  }

  render () {
    const displayedFlashcards = this.getDisplayedFlashcards();
    return (
      <div>
        <Helmet>
          <title>{getI18n().t('flashcardList.title')}</title>
        </Helmet>
        <div>
          <input
              ref={this.searchStringRef}
              type="text"
              value={this.props.searchString}
              onChange={this.onSearchStringChange}
          />
        </div>
        {this.props.searchString ?
          <div>
            {getI18n().t('flashcardList.searchingFor', {searchString: this.props.searchString})}
            {' '}
            (<a
                href
                onClick={this.onClearSearchClick}>
              {getI18n().t('flashcardList.clear')}
            </a>)
          </div> :
          null
        }
        <Paginator
            itemCount={this.props.flashcards.size}
            itemsPerPage={FLASHCARDS_PER_PAGE}
            location={this.props.location}
        />
        {displayedFlashcards.map((flashcard, index) => {
          return (
            <div
                key={flashcard.get('uuid')}>
              {index === 0 || flashcard.get('date') !== displayedFlashcards.getIn([index - 1, 'date']) ?
                <p
                    className="flashcard-list__date">
                  {flashcard.get('date')}
                </p> :
                null
              }
              <Link
                  to={`/flashcards/${flashcard.get('uuid')}`}
                  className={classNames(
                    'flashcard-list__flashcard',
                    flashcard.get('learned') ? 'flashcard-list__flashcard--learned' : 'flashcard-list__flashcard--not-learned'
                  )}>
                <div
                    className="flashcard-list__flashcard__side">{
                    `${flashcard.get('frontText')}`
                }</div>
                <div
                    className="flashcard-list__flashcard__side">{
                    `${flashcard.get('backText')}`
                }</div>
              </Link>
            </div>
          );
        })}
        <Paginator
            itemCount={this.props.flashcards.size}
            itemsPerPage={FLASHCARDS_PER_PAGE}
            location={this.props.location}
        />
      </div>
    );
  }

}

export const FlashcardListContainer = connect(
  state => ({
    flashcards: getters.getFlashcardsSorted(state.get('userData')),
    searchString: state.getIn(['userData', 'searchString'])
  }),
  actionCreators
)(FlashcardList);
