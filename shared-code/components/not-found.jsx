import {getI18n} from '../locales/i18n';

import React from 'react';

export default function NotFound () {
  return (
    <div>
      {getI18n().t('notFound.notFound')}
    </div>
  );
}
