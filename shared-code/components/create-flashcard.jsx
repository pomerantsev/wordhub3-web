import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

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
          <title>{getI18n().t('createFlashcard.title')}</title>
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
              value={getI18n().t('createFlashcard.create')}
          />
        </form>
      </div>
    );
  }

}

export const CreateFlashcardContainer = connect(
  () => ({}),
  actionCreators
)(CreateFlashcard);
