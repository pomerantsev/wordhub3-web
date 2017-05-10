import React from 'react';
import {connect} from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import * as actionCreators from '../data/action-creators';

import {AuthedMenuContainer} from './authed-menu.jsx';

class AuthedRoot extends React.Component {

  render () {
    return (
      <div>
        {this.props.initialLoadingCompleted ?
          <div>
            <AuthedMenuContainer
            />
            {this.props.children}
          </div> :
          <div>
            <CircularProgress
                mode="indeterminate"
            />
          </div>
        }
      </div>
    );
  }

}

export const AuthedRootContainer = connect(
  state => ({
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted'])
  }),
  actionCreators
)(AuthedRoot);
