import {getI18n} from '../locales/i18n';

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

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
  }

  getFlashcard (props) {
    return props.flashcards.get(props.params.uuid);
  }

  render () {
    return this.getFlashcard(this.props) ?
      <div>
        <Helmet>
          <title>{getI18n().t('editFlashcard.title')}</title>
        </Helmet>
        <form
            onSubmit={this.onSubmit}>
          <textarea
              ref={this.frontTextRef}
              rows={6}
              required
              value={this.state.frontText}
              onChange={this.onFrontTextChange}
          />
          <br />
          <textarea
              rows={6}
              required
              value={this.state.backText}
              onChange={this.onBackTextChange}
          />
          <br />
          <input
              type="submit"
              value={getI18n().t('editFlashcard.save')}
          />
        </form>
        <form
            onSubmit={this.deleteFlashcard}>
          <input
              type="submit"
              value={getI18n().t('editFlashcard.delete')}
          />
        </form>
      </div> :
      <NotFound />;
  }

}

export const EditFlashcardContainer = connect(
  state => ({
    flashcards: getters.getFlashcards(state.get('userData'))
  }),
  actionCreators
)(EditFlashcard);
