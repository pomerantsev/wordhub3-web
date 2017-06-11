import React from 'react';

export default class UnauthedRoot extends React.Component {

  render () {
    return (
      <div
          className="unauthed-root__container">
        {this.props.children}
      </div>
    );
  }

}
