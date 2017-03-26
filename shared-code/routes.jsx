import React from 'react';
import {IndexRoute, Route} from 'react-router';

import * as authUtils from './utils/auth-utils';
import * as constants from './data/constants';

import {AppContainer} from './components/app.jsx';
import {HomeContainer} from './components/home.jsx';
import {CreateFlashcardContainer} from './components/create-flashcard.jsx';

function onAuthedEnter (store, nextState, replace) {
  if (!authUtils.isLoggedIn(store.getState())) {
    replace(constants.defaultUnauthedPath);
  }
}

function onUnauthedEnter (store, nextState, replace) {
  if (authUtils.isLoggedIn(store.getState())) {
    replace(constants.defaultAuthedPath);
  }
}

function getRoutes (store) {
  return (
    <Route
        path="/"
        component={AppContainer}>
      <IndexRoute
          component={HomeContainer}
          onEnter={onUnauthedEnter.bind(null, store)}
      />
      <Route
          path="/flashcards/new"
          component={CreateFlashcardContainer}
          onEnter={onAuthedEnter.bind(null, store)}
      />

    </Route>
  );
}

export default getRoutes;
