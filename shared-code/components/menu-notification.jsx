import React from 'react';
import {translate} from 'react-i18next';
import classNames from 'classnames';

import Tooltip from './tooltip.jsx';

class MenuNotification extends React.Component {

  render () {
    const {t} = this.props;
    return (
      <div
          className="menu-notification">
        <div
            className={classNames({
              'menu-notification__primary--warning': this.props.type === 'warning',
              'menu-notification__primary--danger': this.props.type === 'danger'
            })}>
          {this.props.title}
        </div>
        <div
            className="menu-notification__secondary">
          (
          <Tooltip
              className="menu-notification__tooltip-toggle"
              text={this.props.hint}>
            {t('notifications.whatsThis')}
          </Tooltip>
          )
        </div>
      </div>
    );
  }

}

export default translate()(MenuNotification);
