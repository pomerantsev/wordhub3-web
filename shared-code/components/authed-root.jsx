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
          <div>
            <AuthedMenuContainer
            />
            {typeof this.props.syncError === 'number' ?
              <div
                  className="authed-root__alert">
                {getI18n().t(`errors.sync.${this.props.syncError}`)}
              </div> :
              null
            }
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
    initialLoadingCompleted: state.getIn(['userData', 'initialLoadingCompleted']),
    syncError: state.getIn(['userData', 'syncError'])
  }),
  actionCreators
)(AuthedRoot);
