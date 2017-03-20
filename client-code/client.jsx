import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import getRoutes from '../shared-code/routes.jsx';
import * as actionCreators from '../shared-code/data/action-creators';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, browserHistory as history} from 'react-router';
import transit from 'transit-immutable-js';

import asyncMiddleware from '../shared-code/data/async-middleware';
import reducer from '../shared-code/reducers/core-reducer';

const initialState = (() => {
  try {
    return transit.fromJSON(window.__SERIALIZED_INITIAL_STATE__);
  } catch (e) {
    return undefined;
  }
})();

const store = applyMiddleware(asyncMiddleware)(createStore)(reducer, initialState);

store.dispatch(actionCreators.rehydrateCredentials());

ReactDOM.render(
  <Provider
      store={store}>
    <Router
        history={history}
        routes={getRoutes(store)} />
  </Provider>,
  document.getElementById('app')
);
