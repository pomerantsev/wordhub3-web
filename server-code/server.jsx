import dotenv from 'dotenv';
dotenv.config({silent: true});

import express from 'express';
import httpsRedirect from 'express-https-redirect';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {match, RouterContext} from 'react-router';
import {fromJS} from 'immutable';
import transit from 'transit-immutable-js';

import * as actionCreators from '../shared-code/data/action-creators';
import reducer from '../shared-code/reducers/core-reducer';
import asyncMiddleware from '../shared-code/data/async-middleware';
import getRoutes from '../shared-code/routes.jsx';
import * as constants from '../shared-code/data/constants';

const app = express();

// https://blog.risingstack.com/node-js-security-checklist/
app.use(helmet({
  frameguard: false
}));

app.use((req, res, next) => {
  res.set({
    // https://www.troyhunt.com/understanding-http-strict-transport/
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  next();
});

app.get('/ping', (req, res) => {
  // A health address
  res.sendStatus(200);
});

app.use(express.static('dist'));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    httpsRedirect()(req, res, next);
  } else {
    next();
  }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use((req, res) => {
  function setCookieOnServer (key, jsValue) {
    if (jsValue) {
      try {
        res.cookie(key, JSON.stringify(jsValue));
      } catch (e) {
        console.error(e);
      }
    } else {
      res.clearCookie(key);
    }
  }

  const store = applyMiddleware(asyncMiddleware)(createStore)(reducer);

  try {
    const credentials = fromJS(JSON.parse(req.cookies[constants.credentialsKey]));
    store.dispatch(actionCreators.rehydrateCredentials(credentials, setCookieOnServer));
  } catch (e) {}

  match({routes: getRoutes(store, setCookieOnServer), location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      // This is probably an error that happens during async route resolution
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).send('Not found');
    }

    function renderView () {
      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      const componentHTML = renderToString(InitialComponent);

      return new Promise((resolve, reject) => {
        app.render('index', {
          componentHTML,
          serializedInitialState: transit.toJSON(store.getState())
        }, (err, html) => {
          if (err) {
            reject(err);
          } else {
            resolve(html);
          }
        });
      });
    }

    renderView()
      .then(html => res.type('html').end(html))
      .catch(err => {
        res.status(500).send(err.message);
      });

  });

});

export default app;
