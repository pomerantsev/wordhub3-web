import React from 'react';
import {translate} from 'react-i18next';
import {Helmet} from 'react-helmet';

function Intro (props) {
  const {t} = props;
  return (
    <div>
      <Helmet>
        <title>{t('intro.title')}</title>
      </Helmet>
      <div>Hello Intro</div>
    </div>
  );
}

export default translate()(Intro);
