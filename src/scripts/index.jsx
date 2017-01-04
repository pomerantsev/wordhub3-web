import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {AppContainer} from './components/app.jsx';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, browserHistory as history, Route} from 'react-router';

import asyncMiddleware from './data/async-middleware';
import reducer from './reducers/core-reducer';

const store = applyMiddleware(asyncMiddleware)(createStore)(reducer);

const routes = (
  <Route
      path="/"
      component={AppContainer}>

  </Route>
);

ReactDOM.render(
  <Provider
      store={store}>
    <Router
        history={history}
        routes={routes} />
  </Provider>,
  document.getElementById('app')
);
