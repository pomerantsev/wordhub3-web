import dotenv from 'dotenv';
dotenv.config({silent: true});

import i18n from '../shared-code/locales/i18n';
import {handle} from 'i18next-express-middleware';
import {I18nextProvider} from 'react-i18next';

import log from 'loglevel';
log.enableAll();

import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {Helmet as ReactHelmet} from 'react-helmet';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {match, RouterContext} from 'react-router';
import {fromJS} from 'immutable';
import transit from 'transit-immutable-js';
import moment from 'moment';

import fs from 'fs';

import * as actionCreators from '../shared-code/data/action-creators';
import reducer from '../shared-code/reducers/core-reducer';
import asyncMiddleware from '../shared-code/data/async-middleware';
import getRoutes from '../shared-code/routes.jsx';
import * as constants from '../shared-code/data/constants';

import NotFound from '../shared-code/components/not-found.jsx';

const app = express();
app.use(compression());

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
    // req.secure is https requests coming directly to server.
    // x-forwarded-proto is a header used by AWS in requests from load balancers
    // to servers.
    const isNotSecure = !(req.secure || req.headers['x-forwarded-proto'] === 'https');
    const isNotCanonicalHostname = req.hostname !== process.env.CANONICAL_HOSTNAME;
    if (isNotSecure || isNotCanonicalHostname) {
      const hostname = process.env.CANONICAL_HOSTNAME;
      res.redirect(`https://${hostname}${req.originalUrl}`);
    } else {
      next();
    }
  } else {
    next();
  }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(handle(i18n));

app.use((req, res) => {
  function setCookieOnServer (key, jsValue) {
    if (jsValue) {
      try {
        res.cookie(key, JSON.stringify(jsValue));
      } catch (e) {
        log.error(e);
      }
    } else {
      res.clearCookie(key);
    }
  }

  i18n.changeLanguage(req.language);

  const store = applyMiddleware(asyncMiddleware)(createStore)(reducer);

  store.dispatch(actionCreators.storeUserAgent(req.headers['user-agent']));

  try {
    const credentials = fromJS(JSON.parse(req.cookies[constants.credentialsKey]));
    store.dispatch(actionCreators.rehydrateCredentials(credentials, setCookieOnServer));
  } catch (e) {}

  match({routes: getRoutes(store, setCookieOnServer), location: req.url}, (error, redirectLocation, renderProps) => {
    moment.locale(req.language);
    if (error) {
      // This is probably an error that happens during async route resolution
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).send('Not found');
    }

    async function renderView () {
      const InitialComponent = (
        <I18nextProvider
            i18n={i18n}>
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        </I18nextProvider>
      );

      const componentHTML = renderToString(InitialComponent);
      const reactHelmet = ReactHelmet.renderStatic();

      const css = await new Promise(resolve => {
        fs.readFile('dist/styles/main.css', 'utf8', (err, cssData) => {
          resolve(cssData);
        });
      });

      return new Promise((resolve, reject) => {
        app.render('index', {
          componentHTML,
          title: reactHelmet.title.toString(),
          serializedInitialState: transit.toJSON(store.getState()),
          css
        }, (err, html) => {
          if (err) {
            reject(err);
          } else {
            resolve(html);
          }
        });
      });
    }

    const objectNotFound = renderProps.routes.find(route => route.component === NotFound);

    renderView()
      .then(html => res.status(objectNotFound ? 404 : 200).type('html').end(html))
      .catch(err => {
        res.status(500).send(err.message);
      });

  });

});

export default app;
