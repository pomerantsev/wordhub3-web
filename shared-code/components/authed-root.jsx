import i18next from 'i18next';

import React from 'react';
import {connect} from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import * as actionCreators from '../data/action-creators';

class AuthedRoot extends React.Component {

  render () {
    return (
      <div>
        {this.props.initialLoadingCompleted ?
          <div
              className="authed-root__container--loaded">
            {this.props.tokenExpired ?
              <div
                  className="authed-root__alert">
                {i18next.t('errors.tokenExpired')}
              </div> :
              null
            }
            {typeof this.props.syncError === 'number' ?
              <div
                  className="authed-root__alert">
                {i18next.t(`errors.sync.${this.props.syncError}`)}
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

export const AuthedRootContainer = connect(
  state => ({
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted']),
    syncError: state.getIn(['userData', 'syncError']),
    tokenExpired: state.getIn(['userData', 'tokenExpired'])
  }),
  actionCreators
)(AuthedRoot);
