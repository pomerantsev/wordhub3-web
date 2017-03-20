import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import getRoutes from './routes.jsx';
import * as actionCreators from './data/action-creators';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, browserHistory as history} from 'react-router';

import asyncMiddleware from './data/async-middleware';
import reducer from './reducers/core-reducer';

const store = applyMiddleware(asyncMiddleware)(createStore)(reducer);

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
