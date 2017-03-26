import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class CreateFlashcard extends React.Component {

  logout (event) {
    event.preventDefault();
    this.props.logout();
  }

  render () {
    return (
      <div>
        Here you can create some flashcards
        <div>
          <a
              href
              onClick={this.logout.bind(this)}>
            Logout
          </a>
        </div>
      </div>
    );
  }

}

export const CreateFlashcardContainer = connect(
  () => ({}),
  actionCreators
)(CreateFlashcard);
