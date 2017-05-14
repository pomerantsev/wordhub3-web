import {getI18n} from '../locales/i18n';

import React from 'react';
import {Helmet} from 'react-helmet';

export default function NotFound () {
  return (
    <div>
      <Helmet>
        <title>{getI18n().t('notFound.title')}</title>
      </Helmet>
      {getI18n().t('notFound.notFound')}
    </div>
  );
}
