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
    this.undoDeletion = this.undoDeletion.bind(this);
    this.onDeletionAlertClose = this.onDeletionAlertClose.bind(this);

    this.searchStringRef = this.searchStringRef.bind(this);
  }

  componentWillMount () {
    this.ensureExistingPage(this.props);
  }

  componentDidMount () {
    if (this.searchStringElement) {
      this.searchStringElement.focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    this.ensureExistingPage(nextProps);
  }

  componentWillUnmount () {
    this.props.finalizeFlashcardDeletion();
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

  undoDeletion () {
    this.props.undoFlashcardDeletion();
  }

  onDeletionAlertClose (event) {
    event.preventDefault();
    this.props.finalizeFlashcardDeletion();
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
        {this.props.recentlyDeletedFlashcard ?
          <div
              className="flashcard-list__deleted-alert">
            <button
                onClick={this.onDeletionAlertClose}
                className="flashcard-list__deleted-alert__close">
              &times;
            </button>
            {getI18n().t('flashcardList.deleted')}
            {' '}
            <span
                className="flashcard-list__deleted-alert__undo"
                onClick={this.undoDeletion}>
              {getI18n().t('flashcardList.undo')}
            </span>
          </div> :
          null
        }
        {this.props.allFlashcards.size === 0 ?
          <div>
            <p
                className="flashcard-list__no-flashcards-text">
              {getI18n().t('flashcardList.noFlashcards')}
            </p>
            <p
                className="flashcard-list__no-flashcards-text">
              <Link
                  to="/flashcards/new">
                {getI18n().t('flashcardList.create')}
              </Link>
            </p>
          </div> :
          <div>
            <div
                className="flashcard-list__search-form-container">
              <form
                  className={classNames({
                    'flashcard-list__search-form': true,
                    'flashcard-list__search-form--with-bottom-margin': !!this.props.searchString
                  })}>
                <div
                    className="flashcard-list__search-form__form-group">
                  <div
                      className="flashcard-list__search-form__input-group">
                    <div
                        className="flashcard-list__search-form__label">
                      {getI18n().t('flashcardList.search')}
                    </div>
                    <input
                        ref={this.searchStringRef}
                        type="text"
                        className="flashcard-list__search-form__input"
                        value={this.props.searchString}
                        onChange={this.onSearchStringChange}
                    />
                  </div>
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
              </form>
              <Paginator
                  itemCount={this.props.flashcards.size}
                  itemsPerPage={FLASHCARDS_PER_PAGE}
                  location={this.props.location}
              />
            </div>
            {displayedFlashcards.size > 0 ?
              displayedFlashcards.map((flashcard, index) => {
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
              }) :
              <div>
                <p
                    className="flashcard-list__no-flashcards-text">
                  {getI18n().t('flashcardList.noSearchResults')}
                </p>
              </div>
            }
            <Paginator
                itemCount={this.props.flashcards.size}
                itemsPerPage={FLASHCARDS_PER_PAGE}
                location={this.props.location}
            />
          </div>
        }
      </div>
    );
  }

}

export const FlashcardListContainer = connect(
  state => ({
    allFlashcards: getters.getFlashcards(state.get('userData')),
    flashcards: getters.getFlashcardsSorted(state.get('userData')),
    searchString: state.getIn(['userData', 'searchString']),
    recentlyDeletedFlashcard: state.getIn(['userData', 'recentlyDeletedFlashcard'])
  }),
  actionCreators
)(FlashcardList);
