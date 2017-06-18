import React from 'react';
import {translate} from 'react-i18next';

class FlashcardInputs extends React.Component {

  frontTextRef (element) {
    this.props.frontTextRef(element);
  }

  render () {
    const {t} = this.props;
    return (
      <div>
        <div
            className="flashcard-inputs__form-group">
          <label>
            {t('flashcardInputs.frontText')}
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
            {t('flashcardInputs.backText')}
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

export default translate()(FlashcardInputs);
