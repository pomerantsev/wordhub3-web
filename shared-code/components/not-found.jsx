import i18next from 'i18next';

import React from 'react';
import {Helmet} from 'react-helmet';

export default function NotFound () {
  return (
    <div>
      <Helmet>
        <title>{i18next.t('notFound.title')}</title>
      </Helmet>
      {i18next.t('notFound.notFound')}
    </div>
  );
}
