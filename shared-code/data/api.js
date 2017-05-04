const API_VERSION = 'v1';

export async function syncData (token, timestamp, data) {
  console.log('Syncing since', timestamp);
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/sync-data?token=${token}${timestamp ? '&timestamp=' + timestamp : ''}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
  const serverData = await res.json();
  return serverData;
}

export async function login (email, password) {
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({email, password})
  });
  const data = await res.json();
  return data;
}

export async function signup (email, password, name) {
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/user`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({email, password, name})
  });
  const data = await res.json();
  return data;
}
