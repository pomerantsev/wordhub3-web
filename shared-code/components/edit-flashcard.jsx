import i18next from 'i18next';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import FlashcardInputs from './flashcard-inputs.jsx';
import NotFound from './not-found.jsx';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class EditFlashcard extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor () {
    super();

    this.state = {
      frontText: '',
      backText: ''
    };

    this.onFrontTextChange = this.onFrontTextChange.bind(this);
    this.onBackTextChange = this.onBackTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteFlashcard = this.deleteFlashcard.bind(this);

    this.frontTextRef = this.frontTextRef.bind(this);
  }

  componentWillMount () {
    const flashcard = this.getFlashcard(this.props);
    if (flashcard) {
      this.setState({
        frontText: flashcard.get('frontText'),
        backText: flashcard.get('backText')
      });
    }
  }

  componentDidMount () {
    this.frontTextElement.focus();
  }

  componentWillReceiveProps (nextProps) {
    const nextFlashcard = this.getFlashcard(nextProps);
    if (nextFlashcard && !nextFlashcard.equals(this.getFlashcard(this.props))) {
      this.setState({
        frontText: nextFlashcard.get('frontText'),
        backText: nextFlashcard.get('backText')
      });
    }
  }

  frontTextRef (element) {
    this.frontTextElement = element;
  }

  onFrontTextChange (event) {
    this.setState({
      frontText: event.target.value
    });
  }

  onBackTextChange (event) {
    this.setState({
      backText: event.target.value
    });
  }

  onSubmit (event) {
    event.preventDefault();
    this.props.updateFlashcard(this.props.params.uuid, this.state.frontText, this.state.backText);
    this.context.router.goBack();
  }

  deleteFlashcard (event) {
    event.preventDefault();
    this.props.deleteFlashcard(this.props.params.uuid);
    this.context.router.goBack();
    this.setState({
      deleted: true
    });
  }

  getFlashcard (props) {
    return props.flashcards.get(props.params.uuid);
  }

  render () {
    return this.getFlashcard(this.props) ?
      <div>
        <Helmet>
          <title>{i18next.t('editFlashcard.title')}</title>
        </Helmet>
        <form
            onSubmit={this.onSubmit}>
          <FlashcardInputs
              frontTextRef={this.frontTextRef}
              frontText={this.state.frontText}
              backText={this.state.backText}
              onFrontTextChange={this.onFrontTextChange}
              onBackTextChange={this.onBackTextChange}
          />
          <button
              className="edit-flashcard__submit">
            {i18next.t('editFlashcard.save')}
          </button>
          <button
              className="edit-flashcard__delete"
              onClick={this.deleteFlashcard}>
            {i18next.t('editFlashcard.delete')}
          </button>
        </form>
      </div> :
      this.state.deleted ?
        null :
        <NotFound />;
  }

}

export const EditFlashcardContainer = connect(
  state => ({
    flashcards: getters.getFlashcards(state.get('userData'))
  }),
  actionCreators
)(EditFlashcard);
