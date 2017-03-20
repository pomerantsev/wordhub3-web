import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class CreateFlashcard extends React.Component {

  render () {
    return (
      <div>
        Here you can create some flashcards
      </div>
    );
  }

}

export const CreateFlashcardContainer = connect(
  () => ({}),
  actionCreators
)(CreateFlashcard);
