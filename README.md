# Wordhub V3 Web Client

[Wordhub](https://wordhub.io) is an application for storing and managing flashcards.

This is the third major version of the app. The source code for the [first](https://github.com/pomerantsev/wordhub) and [second](https://github.com/pomerantsev/wordhub_on_rails) versions can also be found on Github.

The data server and the clients are fully separated. This is the repository for the web client code.



## Supported browsers

* Chrome (desktop and Android): full support
* Safari, Firefox, IE, Edge: full support for online usage, limited support for offline. When app goes offline, there’s a warning message. You can still do stuff (create flashcards, run repetitions), but if page is reloaded before network connectivity is restored, latest data will be lost.



## General architecture

The basic features of the Wordhub web client are creating / editing flashcards and running repetitions when the time comes.

A distinctive feature of the current version of the client is that disruptions in network connectivity don’t affect user experience: the above mentioned operations can be performed while offline. It’s similar to Google Calendar: you can create / delete tasks at any time, and they will be synchronized with the server when network is available.

There is an issue, of course, with reconciling additions and edits from different clients (say, when the app is open on a laptop and on a phone). The client simply makes necessary changes in its in-memory representation of the data, and then sends latest updates to server. The server then merges conflicts depending on what type of operation it is (creating a flashcard, deleting a flashcard, running a repetition, etc.).



## Server rendering

Wordhub is a single-page application, but on the initial page load, the page HTML comes from the server, and JS follows (what’s called [isomorphic / universal JS](https://medium.com/@mjackson/universal-javascript-4761051b7ae9)). I did it mainly because I could, but there’s also an off-chance of getting higher rankings from Google and faster page loads.



## Technologies / libraries

* [React](https://facebook.github.io/react/): a declarative way of defining dynamic user interfaces.
* [Redux](http://redux.js.org/): a popular data management library.
* [Immutable.js](https://facebook.github.io/immutable-js/): performant immutable data structures (in memory, most of the data is stored in Immutable.js structures).
* [Reselect](https://github.com/reactjs/reselect): a memoization addon for Redux.
* [i18next](https://www.i18next.com/): an i18n library. The UI is fully internationalized, and there are currently two interface languages: English and Russian.
* Service worker: ensures that user can open the website while offline. Service worker’s capabilities are used sparingly, so as to ensure new versions of all resources take precedence over cached ones when network is available.
* Indexed DB: permanent local storage of all user’s data (flashcards and repetitions). Along with service worker, enables full offline support. Currently, only used in Chrome (read operations seem to be too slow in Firefox and Safari when user has a large amount of data, like 10,000 flashcards).
* Cookies: we need a way to store basic user information (username, token) that can be shared between the browser and the web server (which sends the rendered HTML on first request). Cookies seem to be a good fit. We’re not concerned with [CSRF attacks](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) since no state-changing requests can be made to the web server.



## Flaws

The website has a number of flaws. I am well aware of them, but some of them are technically challenging, others simply require time. I felt like releasing the app without addressing these issues, but hopefully one day they’ll all be fixed.
* Reading from Indexed DB is slow. When app starts, all data must be retrieved from Indexed DB. For datasets of considerable sizes, it takes something between a few seconds and well over a minute.
* Operating on a large dataset in memory is also very slow. Any data-changing operation might take a few seconds if the dataset is large and the processing power low.
* No email verification and password recovery. It basically just makes users’ lives harder.
* No way for user to download all of their flashcards to use elsewhere.
* No proper error logging.



## Main files and components

* .babelrc: settings for [Babel](https://babeljs.io/) which transforms code written in future-version JavaScript to one supported by NodeJS and browsers. The file’s two sections (`node` and `browser`) correspond to server-side usage of the code (transformed on the fly) and client-side usage (when browserifying).
* .eslintrc.yml: [ESLint](http://eslint.org/) options.
* nodemon.json: commands that should run at certain points of server’s lifecycle.
* scripts/: some supporting bash scripts.
* app.js is the server’s entry point. It does the following things:
  * It requires `babel-register` so that all subsequent `require`d files are parsed with the Babel parser. Currently, it means transforming ES6 `import`s into `require`s, and async functions to generators.
  * It runs the app server defined in server-code/server.jsx.
  * It runs a livereload server if not in production.
* server-code/server.jsx is the main file defining the express server which serves all of the client’s requests. It has many responsibilities:
  * When in production, redirects all requests to the canonical hostname if hostname or protocol (HTTP vs HTTPS) are different.
  * Detecting and setting interface language.
  * Gzipping assets on the fly.
  * Creating a redux store and populating it with user data (username, token, email).
  * Determining current route using react-router.
  * Responding to user with the page’s HTML.
* server-code/views/index.ejs - the container HTML (`<head>` section, `<script>` tags, etc.).
* client-code/client.jsx is the first code that runs on the client. It starts react, react-router, determines UI language, instantiates and populates the redux store, and sets a subscription to the store so that when user logs in / logs out, they are redirected to a certain URL.
* service-worker/service-worker.js - a service worker with no dependencies. When user fetches a resource, and it’s in the cache, and the connection is slow or non-existent, then the service worker responds with a cached resource. Otherwise, the actual fetch request is performed, and the cache is updated.
* shared-code/routes.jsx - React-router routes definitions.
* shared-code/components/ - react components. All UI is in this folder. Although Bootstrap is used for UI elements, all CSS classes are scoped to components, and Bootstrap classes are only used in CSS files (via `@extend`).
* shared-code/locales/ - all i18n-related code, including setup, custom language detectors, and the localized strings.
* shared-code/reducers/ - redux reducers (see [redux docs](http://redux.js.org/docs/basics/Reducers.html)).
* shared-code/data/action-creators.js - [action creators](http://redux.js.org/docs/basics/Actions.html) for redux.
* shared-code/data/api.js - all backend communication.
* shared-code/data/db-storage.js - all IndexDB-related code.
* shared-code/data/getters.js - [reselect](https://github.com/reactjs/reselect) selectors.
* shared-code/data/storage.js - code for storing / retrieving data in cookies.



## Running locally

Requires nodejs >= 6.

* Run `npm install`.
* Run `npm install -g gulp`.
* Set the following environment variables. An easy way to set them is to [create a .env file in the project’s root](https://www.npmjs.com/package/dotenv). The file is read on server startup and, separately, when browserifying client JS.
  * `NODE_ENV` — set to `development`.
  * `API_SERVER` — you can use http://localhost:3000 if running the server locally, or https://api.wordhub.io if using the production server.
* Run `npm run dev`. That starts the express server.
* In a separate terminal window, run `gulp`. This builds assets into the dist directory, and rebuilds on source changes.



## Testing

While some testing infrastructure is in place (`npm run test`), there are still not many actual tests, and this would be a great area of improvement to make code more resilient to change.



## Deploying to production

AWS Elastic Beanstalk is currently used for wordhub.io (the original production web server).

Application is deployed using the AWS CLI. We would like to deploy the dist directory to the production server, but we don’t want the dist directory to be part of the git repository. So we build deploy the app using a custom script (scripts/aws-deploy.sh) rather than the helper `eb deploy` command.

To deploy, run `npm run aws-deploy`. Make sure to restart the `gulp` process after deployment since the deployment script rewrites the dist directory with production versions of files.

To successfully deploy, two more env vars should be set (presumably, in the .env file):
* `API_SERVER_PROD` - set to https://api.wordhub.io (or your own server).
* `NODE_ENV_PROD` = `production`

Here are the main parameters of the environment:
* All work is unfortunately performed by the node server, including content gzipping. Some of it could be offloaded to a reverse proxy like nginx, but I have never used it before, and the traffic seems sufficiently low for now.
* Load balanced, auto scaling
* Node version: 6
* The following environment variables are set: `NODE_ENV=production`, `API_SERVER=https://api.wordhub.io`, `CANONICAL_HOSTNAME=wordhub.io`.
