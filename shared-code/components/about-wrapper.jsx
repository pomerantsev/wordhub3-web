import React from 'react';
import {translate} from 'react-i18next';
import {Link} from 'react-router';

function AboutWrapper (props) {
  const {t} = props;
  return (
    <div>
      <h2>
        {t('aboutWrapper.heading')}
      </h2>
      <ul>
        <li>
          <Link
              to="/intro">
            {t('aboutWrapper.intro')}
          </Link>
        </li>
        <li>
          <Link
              to="/about">
            {t('aboutWrapper.about')}
          </Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
}

export default translate()(AboutWrapper);
