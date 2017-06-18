import log from 'loglevel';

const API_VERSION = 'v1';

export async function syncData (token, timestamp, data) {
  log.debug('Syncing since', timestamp);
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/sync-data?token=${token}${timestamp ? '&timestamp=' + timestamp : ''}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
  const serverData = await res.json();
  if (res.ok) {
    return serverData;
  } else {
    throw {
      status: res.status,
      body: serverData
    };
  }
}

export async function getUserSettings (token) {
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/user?token=${token}`);
  return await res.json();
}

export async function updateUserSettings (token, {dailyLimit, name, interfaceLanguageId}) {
  return await fetch(`${process.env.API_SERVER}/${API_VERSION}/update-user?token=${token}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({dailyLimit, name, interfaceLanguageId})
  });
}

export async function login (email, password) {
  return await fetch(`${process.env.API_SERVER}/${API_VERSION}/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({email, password})
  });
}

export async function signup ({email, password, name, language}) {
  return await fetch(`${process.env.API_SERVER}/${API_VERSION}/user`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({email, password, name, language})
  });
}
