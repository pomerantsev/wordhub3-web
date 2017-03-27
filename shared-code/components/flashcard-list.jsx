import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class FlashcardList extends React.Component {

  render () {
    return (
      <div>
        All flashcards will be here
      </div>
    );
  }

}

export const FlashcardListContainer = connect(
  () => ({}),
  actionCreators
)(FlashcardList);
