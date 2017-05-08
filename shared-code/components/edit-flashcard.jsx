import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class EditFlashcard extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
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

  componentWillReceiveProps (nextProps) {
    const nextFlashcard = this.getFlashcard(nextProps);
    if (nextFlashcard && !nextFlashcard.equals(this.getFlashcard(this.props))) {
      this.setState({
        frontText: nextFlashcard.get('frontText'),
        backText: nextFlashcard.get('backText')
      });
    }
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

  getFlashcard (props) {
    return props.flashcards.get(props.params.uuid);
  }

  render () {
    return (
      <div>
        <form
            onSubmit={this.onSubmit}>
          <textarea
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
              value="Save"
          />
        </form>
      </div>
    );
  }

}

export const EditFlashcardContainer = connect(
  state => ({
    flashcards: state.getIn(['userData', 'flashcards'])
  }),
  actionCreators
)(EditFlashcard);
