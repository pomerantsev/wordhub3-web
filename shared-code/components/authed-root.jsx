import {getI18n} from '../locales/i18n';

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
          <div
              className="authed-root__container--loaded">
            <AuthedMenuContainer
            />
            {this.props.tokenExpired ?
              <div
                  className="authed-root__alert">
                {getI18n().t('errors.tokenExpired')}
              </div> :
              null
            }
            {typeof this.props.syncError === 'number' ?
              <div
                  className="authed-root__alert">
                {getI18n().t(`errors.sync.${this.props.syncError}`)}
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
