import React from 'react';
import {translate} from 'react-i18next';
import {Helmet} from 'react-helmet';

function NotFound (props) {
  const {t} = props;
  return (
    <div>
      <Helmet>
        <title>{t('notFound.title')}</title>
      </Helmet>
      {t('notFound.notFound')}
    </div>
  );
}

export default translate()(NotFound);
