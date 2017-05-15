import React from 'react';

import UnauthedMenu from './unauthed-menu.jsx';

export default class UnauthedRoot extends React.Component {

  render () {
    return (
      <div
          className="unauthed-root__container">
        <UnauthedMenu
        />
        {this.props.children}
      </div>
    );
  }

}
