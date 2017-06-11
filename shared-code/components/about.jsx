import React from 'react';
import {translate} from 'react-i18next';
import {Helmet} from 'react-helmet';

function About (props) {
  const {t} = props;
  return (
    <div>
      <Helmet>
        <title>{t('about.title')}</title>
      </Helmet>
      <div>Hello About</div>
    </div>
  );
}

export default translate()(About);
