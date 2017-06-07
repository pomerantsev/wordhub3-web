import React from 'react';
import {IndexRoute, Route} from 'react-router';

import * as authUtils from './utils/auth-utils';
import * as constants from './data/constants';

import {AppContainer} from './components/app.jsx';
import UnauthedRoot from './components/unauthed-root.jsx';
import Home from './components/home.jsx';
import Signup from './components/signup.jsx';
import {AuthedRootContainer} from './components/authed-root.jsx';
import {CreateFlashcardContainer} from './components/create-flashcard.jsx';
import {EditFlashcardContainer} from './components/edit-flashcard.jsx';
import {FlashcardListContainer} from './components/flashcard-list.jsx';
import {RepetitionsContainer} from './components/repetitions.jsx';
import {StatsContainer} from './components/stats.jsx';
import NotFound from './components/not-found.jsx';

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

      <Route
          component={UnauthedRoot}
          onEnter={onUnauthedEnter.bind(null, store)}>

        <IndexRoute
            component={Home}
        />

        <Route
            path="/signup"
            component={Signup}
        />

      </Route>

      <Route
          component={AuthedRootContainer}
          onEnter={onAuthedEnter.bind(null, store)}>

        <Route
            path="/flashcards"
            component={FlashcardListContainer}
        />

        <Route
            path="/flashcards/new"
            component={CreateFlashcardContainer}
        />

        <Route
            path="/flashcards/:uuid"
            component={EditFlashcardContainer}
        />

        <Route
            path="/repetitions"
            component={RepetitionsContainer}
        />

        <Route
            path="/stats"
            component={StatsContainer}
        />

      </Route>

      <Route
          path="/**"
          component={NotFound}
      />

    </Route>
  );
}

export default getRoutes;
