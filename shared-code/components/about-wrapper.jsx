import React from 'react';
import {translate} from 'react-i18next';
import {Link} from 'react-router';
import classNames from 'classnames';

import Intro from './intro.jsx';
import About from './about.jsx';

class AboutWrapper extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  render () {
    const routes = this.context.router.routes;
    const {t} = this.props;
    return (
      <div>
        <h2>
          {t('aboutWrapper.heading')}
        </h2>
        <ul
            className="about-wrapper__nav">
          <li
              className={classNames({
                'about-wrapper__nav__active-item': !!routes.find(route => route.component === Intro)
              })}>
            <Link
                to="/intro">
              {t('aboutWrapper.intro')}
            </Link>
          </li>
          <li
              className={classNames({
                'about-wrapper__nav__active-item': !!routes.find(route => route.component === About)
              })}>
            <Link
                to="/about">
              {t('aboutWrapper.about')}
            </Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }

}

export default translate()(AboutWrapper);
