import log from 'loglevel';

// This is a combination of two approaches:
// 1. Code from https://github.com/gaearon/redux-thunk/blob/f8d41b003221c270639cdd8eba19f8e9a141b53d/src/index.js,
//    with one small improvement: we can pass the return value of the action function to next(), so we don't have
//    to create artificial actions (more on this here: https://www.npmjs.com/package/redux-side-effect)
//    It's a way to pass dispatch and getState to actions and create free-form async actions.
// 2. Accepting promise as one of action's params, to create three actions from one:
//    https://medium.com/front-end-developers/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4

export default function asyncMiddleware ({dispatch, getState}) {
  return next => action => {
    let actionObject;
    if (typeof action === 'function') {
      const returnValue = action(dispatch, getState);
      if (typeof returnValue === 'object') {
        actionObject = returnValue;
      } else {
        return returnValue;
      }
    } else {
      actionObject = action;
    }

    const {promise, type, ...rest} = actionObject;

    if (!promise) {
      return next(actionObject);
    }

    const SUCCESS = type;
    const REQUEST = type + '_REQUEST';
    const FAILURE = type + '_FAILURE';

    next({promise, ...rest, type: REQUEST});

    return promise
      .then(result => {
        next({...rest, result, type: SUCCESS});
        return true;
      })
      .catch(error => {
        next({...rest, error, type: FAILURE});
        log.info(error);
        return false;
      });
  };
}
