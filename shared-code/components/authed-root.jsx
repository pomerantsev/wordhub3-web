import React from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';

import * as actionCreators from '../data/action-creators';

class AuthedRoot extends React.Component {

  render () {
    const {t} = this.props;
    return (
      <div>
        {this.props.initialLoadingCompleted ?
          <div
              className="authed-root__container--loaded">
            {typeof this.props.syncError === 'number' ?
              <div
                  className="authed-root__alert">
                {t(`errors.${this.props.syncError}`)}
              </div> :
              null
            }
            {this.props.children}
          </div> :
          <div
              className="authed-root__container--pending">
            <CircularProgress
                size={100}
                thickness={4}
                color="currentColor"
                mode="indeterminate"
            />
          </div>
        }
      </div>
    );
  }

}

const AuthedRootContainer = connect(
  state => ({
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted']),
    syncError: state.getIn(['userData', 'syncError'])
  }),
  actionCreators
)(AuthedRoot);

export default translate()(AuthedRootContainer);
