import {getI18n} from '../locales/i18n';

import React from 'react';
import classNames from 'classnames';

import Tooltip from './tooltip.jsx';

export default class MenuNotification extends React.Component {

  render () {
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
            {getI18n().t('notifications.whatsThis')}
          </Tooltip>
          )
        </div>
      </div>
    );
  }

}
