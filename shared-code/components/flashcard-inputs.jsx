import {getI18n} from '../locales/i18n';

import React from 'react';

export default class FlashcardInputs extends React.Component {

  frontTextRef (element) {
    this.props.frontTextRef(element);
  }

  render () {
    return (
      <div>
        <div
            className="flashcard-inputs__form-group">
          <label>
            {getI18n().t('flashcardInputs.frontText')}
          </label>
          <textarea
              ref={this.frontTextRef.bind(this)}
              className="flashcard-inputs__textarea"
              rows={6}
              required
              value={this.props.frontText}
              onChange={this.props.onFrontTextChange}
          />
        </div>
        <div
            className="flashcard-inputs__form-group">
          <label>
            {getI18n().t('flashcardInputs.backText')}
          </label>
          <textarea
              className="flashcard-inputs__textarea"
              rows={6}
              required
              value={this.props.backText}
              onChange={this.props.onBackTextChange}
          />
        </div>
      </div>
    );
  }

}
