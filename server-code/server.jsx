import dotenv from 'dotenv';
dotenv.config({silent: true});

import 'isomorphic-fetch';

import i18next from 'i18next';
import {i18nextOptions} from '../shared-code/locales/i18n';
import ServerLanguageDetector from '../shared-code/locales/server-language-detector';
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

import fs from 'fs';

import * as actionCreators from '../shared-code/data/action-creators';
import reducer from '../shared-code/reducers/core-reducer';
import asyncMiddleware from '../shared-code/data/async-middleware';
import getRoutes from '../shared-code/routes.jsx';
import * as constants from '../shared-code/data/constants';
import * as helpers from '../shared-code/utils/helpers';

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

app.use(async function (req, res) {
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

  const store = applyMiddleware(asyncMiddleware)(createStore)(reducer);

  store.dispatch(actionCreators.storeUserAgent(req.headers['user-agent']));

  try {
    const credentials = fromJS(JSON.parse(req.cookies[constants.credentialsKey]));
    store.dispatch(actionCreators.rehydrateCredentials(credentials, setCookieOnServer));
  } catch (e) {}

  const token = store.getState().getIn(['credentials', 'token']);
  if (token) {
    store.dispatch(await actionCreators.storeUserSettings(token));
  }

  i18next.use(
    new ServerLanguageDetector(null, {
      order: ['querystring', 'userPreference', 'header'],
      lookupQuerystring: 'lng',
      getUserLanguageId: () => store.getState().getIn(['userData', 'userSettings', 'interfaceLanguageId'])
    })
  ).init(i18nextOptions);

  const languageName = i18next.services.languageDetector.detect(req, res);
  helpers.changeLanguage(languageName);

  match({routes: getRoutes(store, setCookieOnServer), location: req.url}, (error, redirectLocation, renderProps) => {
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
            i18n={i18next}>
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        </I18nextProvider>
      );

      const componentHTML = renderToString(InitialComponent);
      const reactHelmet = ReactHelmet.renderStatic();

      // We want to send CSS along with the HTML so that
      // Google’s Page Speed Insigts website doesn’t complain.
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
