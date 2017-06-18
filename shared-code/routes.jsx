import React from 'react';
import {IndexRoute, Route} from 'react-router';

import * as authUtils from './utils/auth-utils';
import * as constants from './data/constants';

import App from './components/app.jsx';
import AboutWrapper from './components/about-wrapper.jsx';
import Intro from './components/intro.jsx';
import About from './components/about.jsx';
import UnauthedRoot from './components/unauthed-root.jsx';
import Home from './components/home.jsx';
import Signup from './components/signup.jsx';
import AuthedRoot from './components/authed-root.jsx';
import CreateFlashcard from './components/create-flashcard.jsx';
import EditFlashcard from './components/edit-flashcard.jsx';
import FlashcardList from './components/flashcard-list.jsx';
import Repetitions from './components/repetitions.jsx';
import Stats from './components/stats.jsx';
import Settings from './components/settings.jsx';
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
        component={App}>

      <Route
          component={AboutWrapper}>

        <Route
            path="/intro"
            component={Intro}
        />

        <Route
            path="/about"
            component={About}
        />

      </Route>

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
          component={AuthedRoot}
          onEnter={onAuthedEnter.bind(null, store)}>

        <Route
            path="/flashcards"
            component={FlashcardList}
        />

        <Route
            path="/flashcards/new"
            component={CreateFlashcard}
        />

        <Route
            path="/flashcards/:uuid"
            component={EditFlashcard}
        />

        <Route
            path="/repetitions"
            component={Repetitions}
        />

        <Route
            path="/stats"
            component={Stats}
        />

        <Route
            path="/settings"
            component={Settings}
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
