import React from 'react';
import {connect} from 'react-redux';

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
              value="Create"
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
