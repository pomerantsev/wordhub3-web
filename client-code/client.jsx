import 'babel-polyfill';
import 'whatwg-fetch';

import i18n from '../shared-code/locales/i18n';
import {I18nextProvider} from 'react-i18next';
import moment from 'moment';
moment.locale(i18n.language);

import log from 'loglevel';
if (process.env.NODE_ENV === 'development' || /(\?|&)debug/.test(window.location.search)) {
  log.enableAll();
} else {
  log.setLevel('error');
}

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import getRoutes from '../shared-code/routes.jsx';
import * as actionCreators from '../shared-code/data/action-creators';
import * as authUtils from '../shared-code/utils/auth-utils';
import * as constants from '../shared-code/data/constants';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, browserHistory as history} from 'react-router';
import transit from 'transit-immutable-js';

import asyncMiddleware from '../shared-code/data/async-middleware';
import reducer from '../shared-code/reducers/core-reducer';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

const initialState = (() => {
  try {
    return transit.fromJSON(window.__SERIALIZED_INITIAL_STATE__);
  } catch (e) {
    return undefined;
  }
})();

const store = applyMiddleware(asyncMiddleware)(createStore)(reducer, initialState);

store.dispatch(actionCreators.storeUserAgent(window.navigator.userAgent));

store.dispatch(actionCreators.rehydrateCredentials());

let wasLoggedIn = authUtils.isLoggedIn(store.getState());

if (wasLoggedIn) {
  store.dispatch(actionCreators.startLoggedInState());
}

store.subscribe(() => {
  const isLoggedIn = authUtils.isLoggedIn(store.getState());
  if (!wasLoggedIn && isLoggedIn) {
    wasLoggedIn = isLoggedIn;
    history.replace(constants.defaultAuthedPath);
  } else if (wasLoggedIn && !isLoggedIn) {
    wasLoggedIn = isLoggedIn;
    history.replace(constants.defaultUnauthedPath);
  }
});

ReactDOM.render(
  <I18nextProvider
      i18n={i18n}>
    <Provider
        store={store}>
      <Router
          history={history}
          routes={getRoutes(store)} />
    </Provider>
  </I18nextProvider>,
  document.getElementById('app')
);
