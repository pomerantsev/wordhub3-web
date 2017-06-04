import i18next from 'i18next';

import React from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import FlashcardInputs from './flashcard-inputs.jsx';

import * as actionCreators from '../data/action-creators';

class CreateFlashcard extends React.Component {

  constructor () {
    super();

    this.state = {
      frontText: '',
      backText: ''
    };

    this.onFrontTextChange = this.onFrontTextChange.bind(this);
    this.onBackTextChange = this.onBackTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.frontTextRef = this.frontTextRef.bind(this);
  }

  componentDidMount () {
    this.frontTextElement.focus();
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
    this.props.createFlashcard(this.state.frontText, this.state.backText);
    this.setState({
      frontText: '',
      backText: ''
    });
    this.frontTextElement.focus();
  }

  render () {
    return (
      <div>
        <Helmet>
          <title>{i18next.t('createFlashcard.title')}</title>
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
              className="create-flashcard__submit">
            {i18next.t('createFlashcard.create')}
          </button>
        </form>
      </div>
    );
  }

}

export const CreateFlashcardContainer = connect(
  () => ({}),
  actionCreators
)(CreateFlashcard);
