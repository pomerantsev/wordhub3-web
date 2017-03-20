import {fromJS} from 'immutable';
import Cookies from 'js-cookie';

import * as constants from './constants';

export function storeCredentials (credentials, setCookieOnServer) {
  if (setCookieOnServer) {
    setCookieOnServer(constants.credentialsKey, credentials.toJS());
  } else {
    Cookies.set(constants.credentialsKey, credentials.toJS());
  }
}

export function getCredentials () {
  // Only works on the client,
  // Cookies.getJSON will always produce undefined on server.
  try {
    const cookieValue = Cookies.getJSON(constants.credentialsKey);
    if (typeof cookieValue === 'string') {
      // JSON couldn't really be parsed
      throw new Error();
    }
    return fromJS(cookieValue);
  } catch (e) {
    return null;
  }
}

export function deleteCredentials (setCookieOnServer) {
  if (setCookieOnServer) {
    setCookieOnServer(constants.credentialsKey);
  } else {
    Cookies.remove(constants.credentialsKey);
  }
}
